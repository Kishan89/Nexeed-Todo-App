import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FilterTabs = ({ filter, setFilter }) => {
  return (
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
            style={[styles.filterText, filter === f && styles.filterTextActive]}
          >
            {f}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const spacing = { sm: 8, md: 16, lg: 18 };

const styles = StyleSheet.create({
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
});

export default FilterTabs;
