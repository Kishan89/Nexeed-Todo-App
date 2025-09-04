import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Alert, TouchableOpacity,
  KeyboardAvoidingView, SafeAreaView, ScrollView, Platform, StatusBar, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; 

import { auth, db } from '../config/firebaseConfig';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      await updateProfile(auth.currentUser, {
        displayName: name.trim(),
      });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: serverTimestamp(),
      });

    } catch (err) {
      Alert.alert('Signup Failed', err.message);
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

            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/icon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Start organizing your life today.</Text>
            </View>

            <View style={styles.card}>
              <Input
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
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
              <View style={styles.buttonContainer}>
                <Button
                  title="Create Account"
                  onPress={handleSignup}
                  loading={loading}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}> Log In</Text>
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
  buttonContainer: { marginTop: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: { color: '#9CA3AF', fontSize: 14 },
  footerLink: { color: '#8B5CF6', fontWeight: 'bold', fontSize: 14 },
});
