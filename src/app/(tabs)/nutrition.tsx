import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NutritionTab() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        
        {/* Calendar Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarRow}>
          {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, index) => {
            const date = 12 + index;
            const isSelected = day === 'TUE';
            return (
              <View key={day} style={[styles.dayCard, isSelected && styles.dayCardSelected]}>
                <Text style={[styles.dayName, isSelected && styles.dayTextSelected]}>{day}</Text>
                <Text style={[styles.dayNumber, isSelected && styles.dayTextSelected]}>{date}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.caloriesHeader}>
            <View>
              <Text style={styles.caloriesValue}>1,420</Text>
              <Text style={styles.caloriesLabel}>Calories Eaten</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.caloriesRemainingValue}>580</Text>
              <Text style={styles.caloriesRemainingLabel}>Kcal Remaining</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFill} />
          </View>

          <View style={styles.macrosRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>CARBS</Text>
              <Text style={styles.macroValue}>142g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>PROTEIN</Text>
              <Text style={styles.macroValue}>56g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>FAT</Text>
              <Text style={styles.macroValue}>34g</Text>
            </View>
          </View>
        </View>

        {/* Meals Section */}
        <View style={styles.mealsHeader}>
          <Text style={styles.mealsTitle}>Today's Meals</Text>
          <TouchableOpacity style={styles.addMealButton}>
            <Ionicons name="add" size={16} color="#2E5C31" />
            <Text style={styles.addMealText}>Add Meal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mealItem}>
          <View style={styles.mealIconContainer}>
            <Ionicons name="cafe" size={24} color="#2E5C31" />
          </View>
          <View style={styles.mealDetails}>
            <View style={styles.mealTitleRow}>
              <Text style={styles.mealName}>Breakfast</Text>
              <Text style={styles.mealTime}>08:30 AM</Text>
            </View>
            <Text style={styles.mealDesc}>Oatmeal with blueberries & almonds</Text>
            <View style={styles.mealTag}>
              <Text style={styles.mealTagText}>320 kcal</Text>
            </View>
          </View>
        </View>

        <View style={styles.mealItem}>
          <View style={styles.mealIconContainer}>
            <Ionicons name="restaurant" size={24} color="#2E5C31" />
          </View>
          <View style={styles.mealDetails}>
            <View style={styles.mealTitleRow}>
              <Text style={styles.mealName}>Lunch</Text>
              <Text style={styles.mealTime}>01:15 PM</Text>
            </View>
            <Text style={styles.mealDesc}>Grilled chicken breast with quinoa and avocado salad</Text>
            <View style={styles.mealTag}>
              <Text style={styles.mealTagText}>550 kcal</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 16 },
  calendarRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dayCard: {
    width: 64,
    height: 84,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayCardSelected: {
    backgroundColor: '#2E5C31',
    borderColor: '#2E5C31',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  caloriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  caloriesValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2E5C31',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  caloriesRemainingValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FF7A45',
  },
  caloriesRemainingLabel: {
    fontSize: 14,
    color: '#FF7A45',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginBottom: 24,
  },
  progressBarFill: {
    width: '70%',
    height: '100%',
    backgroundColor: '#2E5C31',
    borderRadius: 4,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mealsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E5C31',
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addMealText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E5C31',
    marginLeft: 4,
  },
  mealItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  mealIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mealDetails: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 24,
  },
  mealTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  mealTime: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  mealDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  mealTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mealTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E5C31',
  }
});
