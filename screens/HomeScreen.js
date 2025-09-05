import { useState, useEffect, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../config/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import TaskItem from "../components/TaskItem";
import HeaderBar from "../components/HeaderBar";
import FilterTabs from "../components/FilterTabs";
import EmptyState from "../components/EmptyState";
import EditTaskModal from "../components/EditTaskModal";
import TaskInput from "../components/TaskInput";

const SkeletonTask = () => {
  return (
    <View style={styles.skeletonTask}>
      <Animated.View style={styles.skeletonCircle} />
      <Animated.View style={styles.skeletonLine} />
    </View>
  );
};

const HomeScreen = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (currentUser?.uid) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) setUserProfile(docSnapshot.data());
      });
      return () => unsubscribe();
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksList = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            text: data.text,
            completed: data.completed,
            userId: data.userId,
            createdAt: data.createdAt?.toDate() || new Date(),
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
          };
        });
        setTasks(tasksList);
        setLoadingTasks(false);
      },
      (error) => {
        console.log("Error fetching tasks:", error);
        setLoadingTasks(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const filteredTasks = useMemo(() => {
    if (filter === "Active") return tasks.filter((t) => !t.completed);
    if (filter === "Completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const handleTaskAdded = (task, updated = false) => {
    if (task.remove) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      return;
    }
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTasks((prev) => [task, ...prev]);
    }
  };

const handleDeleteTask = (taskId) => {
  Alert.alert(
    "Delete Task",
    "Are you sure you want to delete this task?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const originalTasks = [...tasks];
          setTasks((prev) => prev.filter((t) => t.id !== taskId));
          try {
            await deleteDoc(doc(db, "tasks", taskId));
          } catch {
            setTasks(originalTasks);
          }
        },
      },
    ]
  );
};


  const handleToggleComplete = async (task) => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        completed: !task.completed,
      });
    } catch {
      setTasks(tasks);
    }
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setEditText(task.text);
    setEditDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  const handleUpdateTask = async () => {
    if (!currentTask) return;
    const updatedText = editText.trim();
    const updatedDueDate = editDueDate ? editDueDate.toISOString() : null;
    const updatedTasks = tasks.map((t) =>
      t.id === currentTask.id
        ? { ...t, text: updatedText, dueDate: updatedDueDate }
        : t
    );
    setTasks(updatedTasks);
    setModalVisible(false);
    try {
      await updateDoc(doc(db, "tasks", currentTask.id), {
        text: updatedText,
        dueDate: updatedDueDate,
      });
    } catch {
      setTasks(tasks);
    }
  };

  const handleLogout = () => {
  Alert.alert(
    "Logout Confirmation",
    "Are you sure you want to log out?",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => auth.signOut() },
    ]
  );
};

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const emptyMessage = useMemo(() => {
    if (filter === "Active" && tasks.some((t) => t.completed))
      return { title: "All done!", subtitle: "Enjoy your break 🎉" };
    if (filter === "Completed" && tasks.some((t) => !t.completed))
      return {
        title: "Keep going!",
        subtitle: "Finish tasks to see them here 💪",
      };
    return {
      title: "Let's get productive",
      subtitle: "Add your first task 🚀",
    };
  }, [filter, tasks]);

  return (
    <LinearGradient
      colors={["#111827", "#312e81", "#1e1b4b"]}
      style={styles.container}
    >
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1 }}>
          <HeaderBar
            userProfile={userProfile}
            onLogout={handleLogout}
            getGreeting={getGreeting}
          />
          <TaskInput onTaskAdded={handleTaskAdded} />
          <FilterTabs filter={filter} setFilter={setFilter} />
          <FlatList
            data={loadingTasks ? Array.from({ length: 5 }) : filteredTasks}
            keyExtractor={(item, index) => item?.id || index.toString()}
            renderItem={({ item }) =>
              loadingTasks ? (
                <SkeletonTask />
              ) : (
                <TaskItem
                  task={item}
                  onToggleComplete={() => handleToggleComplete(item)}
                  onDelete={() => handleDeleteTask(item.id)}
                  onEdit={() => openEditModal(item)}
                />
              )
            }
            ListEmptyComponent={
              !loadingTasks && (
                <EmptyState
                  title={emptyMessage.title}
                  subtitle={emptyMessage.subtitle}
                />
              )
            }
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom || 20 },
            ]}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <EditTaskModal
          modalVisible={modalVisible}
          editText={editText}
          setEditText={setEditText}
          editDueDate={editDueDate}
          setEditDueDate={setEditDueDate}
          handleUpdateTask={handleUpdateTask}
          closeModal={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const spacing = { xs: 4, sm: 8, md: 16, lg: 18 };
const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  listContent: { paddingHorizontal: spacing.lg },
  skeletonTask: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  skeletonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2c2c4a",
    marginRight: 12,
  },
  skeletonLine: {
    flex: 1,
    height: 18,
    borderRadius: 8,
    backgroundColor: "#3a3a5a",
  },
});

export default HomeScreen;
