import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/AuthLayout";

const getFriendlyErrorMessage = (code) => {
  switch (code) {
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "An error occurred. Please try again.";
  }
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter both email and password."
      );
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err.code);
      Alert.alert("Login Failed", friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout colors={["#1c1855ff", "#0f172a"]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
      </View>
      <LinearGradient
        colors={["rgba(17, 24, 39, 0.9)", "rgba(30, 41, 59, 0.95)"]}
        style={styles.card}
      >
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />
        </View>
      </LinearGradient>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.footerLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 120, height: 120 },
  header: { marginBottom: 24, alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#F9FAFB" },
  subtitle: { color: "#CBD5E1", marginTop: 8, fontSize: 16 },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  forgotPasswordContainer: { alignItems: "flex-end", marginBottom: 16 },
  forgotPasswordText: { color: "#0EA5E9", fontWeight: "600" },
  buttonContainer: { marginTop: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#CBD5E1", fontSize: 14 },
  footerLink: { color: "#0EA5E9", fontWeight: "bold", fontSize: 14 },
});
