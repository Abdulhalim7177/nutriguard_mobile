import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { combineChildSignals } from '../../services/anthropometricClassifier';

export default function ClinicalDataEntryScreen() {
  const router = useRouter();
  
  const [ageMonths, setAgeMonths] = useState('');
  const [muacCm, setMuacCm] = useState('');
  
  const [hasZScores, setHasZScores] = useState(false);
  
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  
  const [whz, setWhz] = useState('');
  const [waz, setWaz] = useState('');
  const [haz, setHaz] = useState('');

  const [result, setResult] = useState<{ finalCategory: string; source: string } | null>(null);

  const handleCalculate = () => {
    const clinical: any = {};
    if (ageMonths) clinical.ageMonths = parseFloat(ageMonths);
    if (muacCm) clinical.muacCm = parseFloat(muacCm);
    
    if (hasZScores) {
      if (whz) clinical.whz = parseFloat(whz);
      if (waz) clinical.waz = parseFloat(waz);
      if (haz) clinical.haz = parseFloat(haz);
    } else {
      // In a real app we would calculate Z-scores from weight and height here 
      // using WHO growth standard tables. For this step, we just use the MUAC.
    }

    const output = combineChildSignals(
      { source: 'photo_model', category: 'healthy', confidence: 0.8 },
      clinical
    );
    setResult(output);
  };

  const getResponsibleMessage = (category: string) => {
    if (category.includes('severe') || category.includes('moderate')) {
      return "This measurement falls in a range that may need attention. Please follow up with a health worker for a professional assessment.";
    }
    if (category === 'normal') {
      return "This measurement appears normal. Continue regular check-ups.";
    }
    return "Please consult a health worker for further advice.";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Child Measurements</Text>
        <Text style={styles.subtitle}>Enter clinical data if available. This takes priority over camera estimates.</Text>

        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Age (months)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 24"
              value={ageMonths}
              onChangeText={setAgeMonths}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>MUAC (cm)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="e.g. 12.5"
              value={muacCm}
              onChangeText={setMuacCm}
            />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>I already have WHZ/WAZ/HAZ scores</Text>
            <Switch value={hasZScores} onValueChange={setHasZScores} />
          </View>

          {hasZScores ? (
            <View style={styles.zScoreContainer}>
              <Text style={styles.sectionHint}>Enter calculated Z-scores from growth chart:</Text>
              <View style={styles.formGroup}>
                <Text style={styles.label}>WHZ (Weight-for-Height Z-score)</Text>
                <TextInput style={styles.input} keyboardType="numbers-and-punctuation" placeholder="-2.0" value={whz} onChangeText={setWhz} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>WAZ (Weight-for-Age Z-score)</Text>
                <TextInput style={styles.input} keyboardType="numbers-and-punctuation" placeholder="-1.5" value={waz} onChangeText={setWaz} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>HAZ (Height-for-Age Z-score)</Text>
                <TextInput style={styles.input} keyboardType="numbers-and-punctuation" placeholder="-1.0" value={haz} onChangeText={setHaz} />
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 10.5" value={weightKg} onChangeText={setWeightKg} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Height/Length (cm)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 85" value={heightCm} onChangeText={setHeightCm} />
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.primaryButton} onPress={handleCalculate}>
            <Text style={styles.buttonText}>Check Status</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Result ({result.finalCategory.replace(/_/g, ' ')})</Text>
            <Text style={styles.resultSource}>Source: {result.source.replace(/_/g, ' ')}</Text>
            <Text style={styles.resultMessage}>{getResponsibleMessage(result.finalCategory)}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  zScoreContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionHint: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  resultSource: {
    fontSize: 12,
    color: '#4338CA',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  resultMessage: {
    fontSize: 15,
    color: '#3730A3',
    lineHeight: 22,
  },
  backButton: {
    alignItems: 'center',
    padding: 16,
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
