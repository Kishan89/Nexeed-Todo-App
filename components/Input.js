// components/Input.js
import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const Input = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#6B7280"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#374151',
    color: '#F9FAFB',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },
});

export default Input;