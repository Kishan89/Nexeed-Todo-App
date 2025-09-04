import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Alert, TouchableOpacity,
  SafeAreaView, Platform, StatusBar, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import Input from '../components/Input';
import Button from '../components/Button';
import { Feather } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Check Your Email',
        'A link to reset your password has been sent to your email address.'
      );
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D1117', '#111827']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

          {/* 🔙 Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#E5E7EB" />
          </TouchableOpacity>

          {/* 🔥 App Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/icon.png')} // apna logo ka naam/extension sahi lagao
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a reset link.
            </Text>
          </View>

          <View style={styles.card}>
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
              />
            </View>
          </View>

          {/* 🔙 Back to Login */}
          <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
            <Feather name="log-in" size={16} color="#8B5CF6" />
            <Text style={styles.footerLink}> Back to Login</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },

  backButton: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 50 : 20, 
    left: 20, 
    padding: 8 
  },

  // 🔥 Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: { width: 120, height: 120 },

  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#F9FAFB' },
  subtitle: { color: '#9CA3AF', marginTop: 8, fontSize: 16, textAlign: 'center' },

  card: { backgroundColor: '#1F2937', borderRadius: 16, padding: 24 },
  buttonContainer: { marginTop: 8 },

  // 🔙 Footer Link
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerLink: {
    color: '#8B5CF6',
    fontWeight: '600',
    fontSize: 15,
  },
});
