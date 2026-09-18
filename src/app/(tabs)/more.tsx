import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MoreTab() {
  const menuItems = [
    { title: 'Profile', icon: 'person-outline', path: '/profile' },
    { title: 'Screening (Voice Intake)', icon: 'mic-outline', path: '/(screening)/voice-intake' },
    { title: 'Camera Scan', icon: 'camera-outline', path: '/(screening)/photo-check' },
    { title: 'Clinical Data Entry', icon: 'document-text-outline', path: '/(screening)/clinical-data-entry' },
    { title: 'Check-In Questionnaire', icon: 'calendar-outline', path: '/(monitoring)/check-in' },
    { title: 'Health Worker Dashboard', icon: 'medkit-outline', path: '/(health-worker)/dashboard' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>More Options</Text>
        
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem} 
              onPress={() => router.push(item.path as any)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon as any} size={24} color="#2E5C31" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 16 },
  header: { fontSize: 28, fontWeight: '800', color: '#2E5C31', marginBottom: 24 },
  menuContainer: { backgroundColor: '#F9FAFB', borderRadius: 20, padding: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#374151' },
});
