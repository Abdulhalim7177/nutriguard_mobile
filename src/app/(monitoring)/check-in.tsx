import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { recordCheckInResponse } from '../../services/monitoringService';

export default function CheckInScreen() {
  const params = useLocalSearchParams();
  const screeningId = parseInt(params.screeningId as string) || 1; // Fallback to 1 for manual testing
  
  const [followedPlan, setFollowedPlan] = useState(false);
  const [budgetChanged, setBudgetChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await recordCheckInResponse(screeningId, { followedPlan, budgetChanged });
      Alert.alert("Thank you!", "Your response has been recorded.", [
        { text: "OK", onPress: () => router.push('/') }
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not save your check-in.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Check-in</Text>
      <Text style={styles.subtitle}>Let us know how your nutrition plan is going this week.</Text>
      
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Did you follow the meal plan?</Text>
          <Switch value={followedPlan} onValueChange={setFollowedPlan} trackColor={{ true: '#059669' }} />
        </View>
        <Text style={styles.hint}>Be honest! It helps us adjust your plan.</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Has your weekly food budget changed?</Text>
          <Switch value={budgetChanged} onValueChange={setBudgetChanged} trackColor={{ true: '#059669' }} />
        </View>
        <Text style={styles.hint}>If yes, we will ask you to update it on your next visit.</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, saving && styles.buttonDisabled]} 
        onPress={handleSubmit} 
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Submit Update'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f4f6' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#4b5563', marginBottom: 30, lineHeight: 24 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', color: '#1f2937', flex: 1, marginRight: 15 },
  hint: { fontSize: 14, color: '#6b7280', marginTop: 10, fontStyle: 'italic' },
  button: { backgroundColor: '#059669', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
