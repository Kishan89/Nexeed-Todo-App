import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Text,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";

const TaskInput = ({ onTaskAdded }) => {
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const currentUser = auth.currentUser;

  const handleAddTask = async () => {
    const text = newTask.trim();
    if (!text || !currentUser) return;

    const tempId = Date.now().toString();
    const optimisticTask = {
      id: tempId,
      text,
      completed: false,
      userId: currentUser.uid,
      createdAt: new Date(),
      dueDate: dueDate ? dueDate.toISOString() : null,
    };

    onTaskAdded(optimisticTask);
    setNewTask("");
    setDueDate(null);
    Keyboard.dismiss();

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        text,
        completed: false,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        dueDate: optimisticTask.dueDate,
      });
      onTaskAdded({ ...optimisticTask, id: docRef.id }, true);
    } catch (err) {
      Alert.alert("Error", "Task could not be added. Try again.");
      onTaskAdded({ ...optimisticTask, remove: true });
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Feather
        name="plus-circle"
        size={28}
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
        onSubmitEditing={handleAddTask}
      />

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.calendarButton}
      >
        <Feather name="calendar" size={24} color="#A78BFA" />
      </TouchableOpacity>

      {dueDate && (
        <Text style={styles.dueDateText}>📅 {dueDate.toDateString()}</Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <Feather name="send" size={26} color="#A78BFA" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12,
  },
  inputIcon: { paddingLeft: 18 },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 18,
    color: "#F9FAFB",
  },
  addButton: { paddingRight: 18, paddingVertical: 10 },
  calendarButton: { paddingRight: 14 },
  dueDateText: { fontSize: 14, color: "#9CA3AF", paddingRight: 10 },
});

export default TaskInput;
