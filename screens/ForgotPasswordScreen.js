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
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        "Check Your Email",
        "A reset link has been sent to your email."
      );
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout colors={["#0f172a", "#1e293b"]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email to get a reset link
        </Text>
      </View>
      <LinearGradient
        colors={["rgba(17, 24, 39, 0.9)", "rgba(30, 41, 59, 0.95)"]}
        style={styles.card}
      >
        <Input
          placeholder="Your Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Send Reset Link"
            onPress={handlePasswordReset}
            loading={loading}
            disabled={loading}
          />
        </View>
      </LinearGradient>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember your password?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.footerLink}> Back to Login</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 120, height: 120 },
  header: { marginBottom: 24, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#F9FAFB" },
  subtitle: {
    color: "#CBD5E1",
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonContainer: { marginTop: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#CBD5E1", fontSize: 14 },
  footerLink: { color: "#0EA5E9", fontWeight: "bold", fontSize: 14 },
});
