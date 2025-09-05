import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";

const EditTaskModal = ({
  modalVisible,
  editText,
  setEditText,
  editDueDate,
  setEditDueDate,
  handleUpdateTask,
  closeModal,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Task</Text>
          <TextInput
            style={styles.modalInput}
            value={editText}
            onChangeText={setEditText}
            onSubmitEditing={handleUpdateTask}
            placeholder="Update your task"
            placeholderTextColor="rgba(249,250,251,0.6)"
          />
          <TouchableOpacity
            style={styles.dueDateButton}
            onPress={() => setShowPicker(true)}
          >
            <Feather name="calendar" size={18} color="#A78BFA" />
            <Text style={styles.dueDateText}>
              {editDueDate ? editDueDate.toDateString() : "Set Due Date"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={editDueDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setEditDueDate(selectedDate);
              }}
            />
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
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
  );
};

const spacing = { sm: 8, md: 16, lg: 18 };

const styles = StyleSheet.create({
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
    marginBottom: spacing.md,
    fontSize: 16,
  },
  dueDateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  dueDateText: {
    color: "#F9FAFB",
    fontSize: 14,
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#374151",
    marginHorizontal: 4,
  },
  modalButtonText: { fontWeight: "600", color: "#F9FAFB" },
  saveButton: { backgroundColor: "#8B5CF6" },
  saveButtonText: { color: "#FFFFFF", fontWeight: "700" },
});

export default EditTaskModal;
