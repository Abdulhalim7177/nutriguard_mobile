import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMealPlan } from '../../services/nutritionService';
import { db } from '../../db/sqlite';
export default function MealPlanScreen() {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const { budget, symptoms } = useLocalSearchParams<{ budget?: string, symptoms?: string }>();

  const fetchMealPlan = async () => {
    setLoading(true);
    setIsOffline(false);
    
    const requestBudget = Number(budget) || 2000;
    const requestSymptoms = symptoms ? symptoms.split(',') : ['fatigue', 'dizziness'];
    const requestDiet = 'mostly rice and carbs'; // default

    const result = await getMealPlan({
      weeklyBudgetNgn: requestBudget,
      symptoms: requestSymptoms,
      dietSummary: requestDiet
    });
    
    if (result) {
      await db.insertMealPlan(JSON.stringify(result));
      setMealPlan(result);
    } else {
      const localPlan = await db.getLatestMealPlan();
      if (localPlan) {
        setMealPlan(localPlan);
      } else {
        setIsOffline(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMealPlan();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Designing your nutrition plan...</Text>
      </View>
    );
  }

  if (isOffline) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>??</Text>
        <Text style={styles.errorTitle}>You're Offline</Text>
        <Text style={styles.errorText}>
          We couldn't reach the NutriGuard servers. Your request has been saved and will sync automatically when your connection returns.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMealPlan}>
          <Text style={styles.retryButtonText}>Retry Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!mealPlan) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#2E5C31" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Meal Plan</Text>
        </View>
        <Text style={styles.subtitle}>Budget: {mealPlan.weekly_budget_ngn} NGN</Text>
        <Text style={styles.focusBadge}>Focus: {mealPlan.focus}</Text>
      </View>
      
      <Text style={styles.explanation}>{mealPlan.explanation}</Text>

      {mealPlan.meal_plan.map((day: any, idx: number) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.dayText}>{day.day}</Text>
            <Text style={styles.costText}>~{day.est_cost_ngn} NGN</Text>
          </View>
          <Text style={styles.mealText}>{day.meal}</Text>
          <View style={styles.nutrientsRow}>
            {day.key_nutrients.map((n: string, i: number) => (
              <View key={i} style={styles.nutrientPill}>
                <Text style={styles.nutrientText}>{n}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20, paddingBottom: 50 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#f3f4f6' },
  loadingText: { marginTop: 20, fontSize: 16, color: '#4b5563' },
  errorIcon: { fontSize: 48, marginBottom: 15 },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  errorText: { fontSize: 16, color: '#4b5563', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  retryButton: { backgroundColor: '#059669', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  retryButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  header: { marginBottom: 20, backgroundColor: 'white', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 5 },
  focusBadge: { backgroundColor: '#dcfce7', color: '#166534', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 10, fontWeight: '600', textTransform: 'capitalize' },
  explanation: { fontSize: 16, color: '#374151', marginBottom: 20, fontStyle: 'italic', lineHeight: 24 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dayText: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  costText: { fontSize: 16, fontWeight: 'bold', color: '#059669' },
  mealText: { fontSize: 16, color: '#4b5563', marginBottom: 15, lineHeight: 24 },
  nutrientsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  nutrientPill: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  nutrientText: { fontSize: 12, color: '#4b5563', fontWeight: '500' }
});
