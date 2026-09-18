import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../db/sqlite';

export default function CheckInTab() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      db.getAllScreenings().then(setHistory).catch(console.error);
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Check-In</Text>
          <Text style={styles.subtitle}>Log your symptoms or scan for anemia risks.</Text>
        </View>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(screening)/voice-intake')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="mic" size={32} color="#2E5C31" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Full Health Check-In</Text>
            <Text style={styles.cardDesc}>Speak or type your symptoms and budget to get a personalized meal plan.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(screening)/photo-check')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#FFF7E6' }]}>
            <Ionicons name="eye" size={32} color="#FF7A45" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Eye Scan Only</Text>
            <Text style={styles.cardDesc}>Quick camera scan of your lower eyelid to detect potential anemia risks.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent History</Text>
        </View>

        {history.length === 0 ? (
          <Text style={styles.noHistoryText}>No check-ins yet. Start one above!</Text>
        ) : (
          history.map((item, index) => {
            const date = new Date(item.createdAt).toLocaleDateString();
            const time = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let riskColor = '#374151';
            let riskLabel = 'Unknown';
            if (item.riskBand === 'low_risk') {
              riskColor = '#059669';
              riskLabel = 'Low Risk';
            } else if (item.riskBand === 'possible_risk' || item.riskBand === 'elevated_risk') {
              riskColor = '#DC2626';
              riskLabel = 'Elevated Risk';
            }
            return (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Ionicons name="time-outline" size={20} color="#9CA3AF" />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyDate}>{date} at {time}</Text>
                  <Text style={[styles.historyRisk, { color: riskColor }]}>{riskLabel}</Text>
                </View>
              </View>
            );
          })
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24, paddingBottom: 60 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#2E5C31', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', lineHeight: 24 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  historyHeader: {
    marginTop: 24,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  noHistoryText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  historyDetails: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  historyRisk: {
    fontSize: 16,
    fontWeight: '700',
  }
});
