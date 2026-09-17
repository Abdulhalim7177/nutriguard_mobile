import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function HomeTab() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, Fatima!</Text>
        <Text style={styles.subtitle}>Let's check your health today.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(screening)/photo-check')}>
          <Text style={styles.actionText}>Take Eye Photo (Anemia Check)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push('/(nutrition)/meal-plan')}>
          <Text style={styles.actionTextSecondary}>View Today's Meal Plan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Check-ins</Text>
        <Text style={styles.text}>Your next weekly review is in 3 days.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { padding: 20, backgroundColor: '#059669', paddingBottom: 40 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 16, color: '#e5e7eb', marginTop: 5 },
  card: { backgroundColor: 'white', margin: 15, marginTop: -20, padding: 20, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1f2937' },
  actionButton: { backgroundColor: '#059669', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  actionText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  actionButtonSecondary: { backgroundColor: '#dcfce7', padding: 15, borderRadius: 10, alignItems: 'center' },
  actionTextSecondary: { color: '#059669', fontWeight: 'bold', fontSize: 16 },
  text: { color: '#4b5563', fontSize: 15 }
});
