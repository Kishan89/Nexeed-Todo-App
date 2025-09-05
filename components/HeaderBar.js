import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const ShimmerLoader = ({ width = 120, height = 28, borderRadius = 6 }) => {
  const shimmerValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(shimmerValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={{
        overflow: "hidden",
        width,
        height,
        borderRadius,
        backgroundColor: "#2c2c4a",
        marginTop: 4,
      }}
    >
      <Animated.View
        style={{
          width: "50%",
          height: "100%",
          backgroundColor: "#3a3a5a",
          transform: [{ translateX }],
        }}
      />
    </View>
  );
};

const HeaderBar = ({ userProfile, onLogout, getGreeting }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>{`Good ${getGreeting()},`}</Text>
        {userProfile?.name ? (
          <Text style={styles.userName}>{userProfile.name}</Text>
        ) : (
          <ShimmerLoader width={140} height={34} borderRadius={8} />
        )}
        <Text style={styles.subtitle}>Let's crush your goals today.</Text>
      </View>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Feather name="log-out" size={22} color="#E5E7EB" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  greeting: { color: "#F9FAFB", fontSize: 22, fontWeight: "600" },
  userName: { color: "#FFFFFF", fontSize: 28, fontWeight: "700", marginTop: 4 },
  subtitle: { color: "#A5B4FC", fontSize: 15, marginTop: 6 },
  logoutButton: {
    padding: 8,
    backgroundColor: "#312E81",
    borderRadius: 12,
  },
});

export default HeaderBar;
