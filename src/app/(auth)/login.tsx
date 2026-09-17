import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NutriGuard</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>
      
      <TextInput placeholder="Phone Number" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'white' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#059669', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#f3f4f6', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#059669', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
