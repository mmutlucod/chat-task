import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { api } from '../services/api';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log("RegisterScreen render edildi");

  const handleRegister = async () => {
    console.log("Kayıt işlemi başlatıldı", { username, email, password });

    try {
      await api.register({ username, email, password });
      console.log("API'ye istek yapıldı, başarılı");

      Alert.alert('Success', 'Registration successful', [
        { text: 'OK', onPress: () => router.push('/auth/login') }
      ]);
    } catch (error: any) { 
      console.log("Hata oluştu:", error);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginLink}
        onPress={() => {
          console.log("Login sayfasına yönlendiriliyor");
          router.push('/auth/login');
        }}
      >
        <Text style={styles.loginText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f5f5',
   padding: 20,
   justifyContent: 'center',
 },
 title: {
   fontSize: 28,
   fontWeight: 'bold',
   color: '#333',
   marginBottom: 30,
   textAlign: 'center',
 },
 inputContainer: {
   marginBottom: 20,
 },
 input: {
   backgroundColor: 'white',
   padding: 15,
   borderRadius: 10,
   marginBottom: 10,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.1,
   shadowRadius: 3,
   elevation: 3,
 },
 button: {
   backgroundColor: '#007AFF',
   padding: 15,
   borderRadius: 10,
   alignItems: 'center',
 },
 buttonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
 },
 loginLink: {
   marginTop: 20,
   alignItems: 'center',
 },
 loginText: {
   color: '#007AFF',
   fontSize: 14,
 },
});
