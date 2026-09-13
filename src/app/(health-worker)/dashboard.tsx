import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getFlaggedUsers } from '../../services/healthWorkerService';

export default function DashboardScreen() {
  const [flaggedUsers, setFlaggedUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const users = await getFlaggedUsers();
      setFlaggedUsers(users);
    };
    loadDashboard();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.userId}>User ID: {item.userId}</Text>
        <View style={[styles.badge, item.riskBand === 'elevated_risk' ? styles.badgeElevated : styles.badgePossible]}>
          <Text style={styles.badgeText}>
            {item.riskBand === 'elevated_risk' ? 'High Risk' : 'Medium Risk'}
          </Text>
        </View>
      </View>
      <Text style={styles.dateText}>Screened on: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Worker Dashboard</Text>
        <Text style={styles.subtitle}>At-Risk Mothers in your region</Text>
      </View>

      {flaggedUsers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>?? No mothers flagged for risk recently!</Text>
        </View>
      ) : (
        <FlatList
          data={flaggedUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: 'white', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 5 },
  list: { padding: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  userId: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeElevated: { backgroundColor: '#fee2e2' },
  badgePossible: { backgroundColor: '#fef3c7' },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#111827' },
  dateText: { fontSize: 14, color: '#6b7280' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#4b5563', fontWeight: '500' }
});
