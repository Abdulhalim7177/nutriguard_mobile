import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeTab() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, Fatima!</Text>
          <Text style={styles.subtitle}>Let's check your health today.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Daily Actions</Text>
            <Ionicons name="flash" size={20} color="#FF7A45" />
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(screening)/photo-check')}>
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Take Eye Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(nutrition)/meal-plan')}>
            <Ionicons name="restaurant-outline" size={20} color="#2E5C31" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>View Today's Meal Plan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardDark}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitleWhite}>Upcoming Check-ins</Text>
            <Ionicons name="calendar-outline" size={20} color="#E8F5E9" />
          </View>
          <Text style={styles.textWhite}>Your next weekly review is in 3 days. Prepare any questions you might have for the health worker.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, backgroundColor: '#FFFFFF' },
  greeting: { fontSize: 28, fontWeight: '800', color: '#2E5C31' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 8 },
  card: { 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 24, 
    marginBottom: 20, 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 2 
  },
  cardDark: {
    backgroundColor: '#2E5C31', 
    marginHorizontal: 24, 
    marginBottom: 20, 
    padding: 20, 
    borderRadius: 20, 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  cardTitleWhite: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  primaryButton: { 
    flexDirection: 'row',
    backgroundColor: '#2E5C31', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 12 
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  secondaryButton: { 
    flexDirection: 'row',
    backgroundColor: '#E8F5E9', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryButtonText: { color: '#2E5C31', fontWeight: '700', fontSize: 16 },
  buttonIcon: { marginRight: 8 },
  textWhite: { color: '#E8F5E9', fontSize: 15, lineHeight: 22 }
});
