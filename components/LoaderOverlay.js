import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

const LoaderOverlay = ({ message = " " }) => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#8B5CF6" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
  
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 12,
    fontWeight: "600",
  },
});

export default LoaderOverlay;
