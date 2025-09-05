import { View, Text, StyleSheet } from "react-native";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
};

const spacing = { sm: 8, lg: 18 };

const styles = StyleSheet.create({
  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: spacing.sm,
  },
  emptySubtitle: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
});

export default EmptyState;
