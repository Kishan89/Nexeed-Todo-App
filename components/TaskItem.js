import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onToggleComplete}
        style={styles.taskContainer}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
          {task.completed && <Feather name="check" size={16} color="#FFFFFF" />}
        </View>
        <View>
          <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
            {task.text}
          </Text>
          {task.createdAt && (
            <Text style={styles.dateText}>
              {new Date(task.createdAt?.toDate()).toLocaleDateString()} •{" "}
              {new Date(task.createdAt?.toDate()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
          <Feather name="edit-2" size={18} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
          <Feather name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    marginBottom: 12,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxCompleted: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  taskText: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '600',
    flexShrink: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
});

export default TaskItem;
