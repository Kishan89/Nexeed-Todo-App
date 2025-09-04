import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Alert, TouchableOpacity,
  KeyboardAvoidingView, SafeAreaView, ScrollView, Platform, StatusBar, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../config/firebaseConfig';
import Input from '../components/Input';
import Button from '../components/Button';

// Helper for user-friendly Firebase error messages
const getFriendlyErrorMessage = (code) => {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return 'An error occurred. Please try again.';
  }
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // The AppNavigator will automatically handle navigation to HomeScreen on successful login
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err.code);
      Alert.alert('Login Failed', friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D1117', '#111827']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

            {/* 🔥 App Logo on Top */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/icon.png')} // <-- apna logo ka naam/extension sahi lagao
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to manage your tasks.</Text>
            </View>

            <View style={styles.card}>
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

              {/* NEW "Forgot Password?" LINK */}
              <TouchableOpacity 
                style={styles.forgotPasswordContainer} 
                onPress={() => navigation.navigate('ForgotPassword')}
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
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.footerLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  // 🔥 New logo styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },

  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#F9FAFB' },
  subtitle: { color: '#9CA3AF', marginTop: 8, fontSize: 16 },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
  },
  
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#cbc8f0ff',
    fontWeight: '600',
  },
  
  buttonContainer: { marginTop: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: { color: '#9CA3AF', fontSize: 14 },
  footerLink: { color: '#8B5CF6', fontWeight: 'bold', fontSize: 14 },
});
