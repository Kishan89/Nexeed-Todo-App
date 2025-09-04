import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { auth, db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import TaskItem from "../components/TaskItem";
import LoaderOverlay from "../components/LoaderOverlay";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;
  const insets = useSafeAreaInsets();

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
        let tasksList = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setTasks(tasksList);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, [currentUser]);

  const filteredTasks = useMemo(() => {
    if (filter === "Active") return tasks.filter((t) => !t.completed);
    if (filter === "Completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const handleAddTask = async () => {
    const text = newTask.trim();
    if (text === "" || !currentUser) return;
    const tempId = Date.now().toString();
    const optimisticTask = {
      id: tempId,
      text,
      completed: false,
      userId: currentUser.uid,
      createdAt: { toDate: () => new Date() },
    };
    setTasks((prev) => [optimisticTask, ...prev]);
    setNewTask("");
    Keyboard.dismiss();
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        text,
        completed: false,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === tempId ? { ...task, id: docRef.id } : task
        )
      );
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
    }
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
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
    ]);
  };

const handleToggleComplete = async (task) => {
  const updated = !task.completed;
  setTasks((prev) =>
    prev.map((t) => (t.id === task.id ? { ...t, completed: updated } : t))
  );
  try {
    await updateDoc(doc(db, "tasks", task.id), { completed: updated });
  } catch (error) {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
    );
    console.log("Error toggling complete:", error);
  }
};


  const openEditModal = (task) => {
    setCurrentTask(task);
    setEditText(task.text);
    setModalVisible(true);
  };

  const handleUpdateTask = async () => {
    if (!currentTask || editText.trim() === "") return;
    try {
      await updateDoc(doc(db, "tasks", currentTask.id), {
        text: editText.trim(),
      });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === currentTask.id ? { ...t, text: editText.trim() } : t
        )
      );
      setModalVisible(false);
      setCurrentTask(null);
      setEditText("");
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => auth.signOut() },
    ]);
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
      return { title: "Keep going!", subtitle: "Finish tasks to see them here 💪" };
    return { title: "Let's get productive", subtitle: "Add your first task 🚀" };
  }, [filter, tasks]);

  return (
    <LinearGradient
      colors={["#111827", "#312E81", "#1E1B4B"]}
      style={styles.container}
    >
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{`Good ${getGreeting()},`}</Text>
              {currentUser?.displayName ? (
                <Text style={styles.userName}>{currentUser.displayName}</Text>
              ) : (
                <View style={styles.nameLoader}>
                  <LoaderOverlay />
                </View>
              )}
              <Text style={styles.subtitle}>Let's crush your goals today.</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Feather name="log-out" size={22} color="#E5E7EB" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Feather
              name="plus-circle"
              size={22}
              color="#A78BFA"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Add a new task..."
              placeholderTextColor="#9CA3AF"
              value={newTask}
              onChangeText={setNewTask}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
              <Feather name="send" size={26} color="#A78BFA" />
            </TouchableOpacity>
          </View>
          <View style={styles.filterContainer}>
            {["All", "Active", "Completed"].map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  filter === f && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(f)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggleComplete={() => handleToggleComplete(item)}
                onDelete={() => handleDeleteTask(item.id)}
                onEdit={() => openEditModal(item)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>{emptyMessage.title}</Text>
                <Text style={styles.emptySubtitle}>{emptyMessage.subtitle}</Text>
              </View>
            }
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom || 20 },
            ]}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Task</Text>
              <TextInput
                style={styles.modalInput}
                value={editText}
                onChangeText={setEditText}
                onSubmitEditing={handleUpdateTask}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateTask}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {loading && <LoaderOverlay message="Fetching tasks..." />}
      </SafeAreaView>
    </LinearGradient>
  );
};

const spacing = { xs: 4, sm: 8, md: 16, lg: 18, xl: 32 };

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  greeting: { color: "#F9FAFB", fontSize: 22, fontWeight: "600" },
  userName: { color: "#FFFFFF", fontSize: 28, fontWeight: "700", marginTop: 4 },
  nameLoader: { height: 34, justifyContent: "center", marginTop: 4 },
  subtitle: { color: "#A5B4FC", fontSize: 15, marginTop: 6 },
  logoutButton: {
    padding: spacing.sm,
    backgroundColor: "#312E81",
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputIcon: { paddingLeft: spacing.md },
  input: { flex: 1, padding: spacing.md, fontSize: 16, color: "#F9FAFB" },
  addButton: { paddingRight: spacing.md, paddingVertical: spacing.sm },
  filterContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  filterButtonActive: {
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  filterText: { color: "#9CA3AF", fontWeight: "600" },
  filterTextActive: { color: "#FFFFFF" },
  listContent: { paddingHorizontal: spacing.lg },
  emptyContainer: { marginTop: 80, alignItems: "center", paddingHorizontal: spacing.lg },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: spacing.sm,
  },
  emptySubtitle: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: "rgba(30,30,46,0.95)",
    padding: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: spacing.md,
    textAlign: "center",
    color: "#F9FAFB",
  },
  modalInput: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#F9FAFB",
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    fontSize: 16,
  },
  modalButtons: { flexDirection: "row", gap: spacing.sm },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#374151",
  },
  modalButtonText: { fontWeight: "600", color: "#F9FAFB" },
  saveButton: { backgroundColor: "#8B5CF6" },
  saveButtonText: { color: "#FFFFFF", fontWeight: "700" },
});

export default HomeScreen;
