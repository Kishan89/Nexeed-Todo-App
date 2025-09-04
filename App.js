import React from "react";
import { View, StatusBar, StyleSheet } from "react-native";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0B0B1D" barStyle="light-content" />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B1D",
  },
});
