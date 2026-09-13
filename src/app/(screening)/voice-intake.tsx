import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { voiceService } from '../../services/voiceService';
import { extractIntent, ExtractedIntent } from '../../services/intentExtraction';

export default function VoiceIntakeScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [extracted, setExtracted] = useState<ExtractedIntent | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    return () => {
      voiceService.stopListening();
    };
  }, []);

  const handleStartVoice = async () => {
    setErrorMsg('');
    setIsListening(true);
    await voiceService.startListening(
      (text) => {
        setIsListening(false);
        const result = extractIntent(text);
        result.input_method = 'voice';
        setExtracted(result);
      },
      (error) => {
        setIsListening(false);
        setErrorMsg(error);
      }
    );
  };

  const handleStopVoice = async () => {
    setIsListening(false);
    await voiceService.stopListening();
  };

  const handleSubmitText = () => {
    if (!typedText.trim()) return;
    const result = extractIntent(typedText);
    result.input_method = 'keyboard';
    setExtracted(result);
  };

  const handleEditField = (field: keyof ExtractedIntent, value: any) => {
    if (extracted) {
      setExtracted({ ...extracted, [field]: value });
    }
  };

  if (extracted) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Confirm Your Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Symptoms</Text>
            <TextInput
              testID="extracted-symptoms-field"
              style={styles.input}
              value={extracted.symptoms.join(', ')}
              onChangeText={(text) => handleEditField('symptoms', text.split(',').map(s => s.trim()))}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Weekly Budget (NGN)</Text>
            <TextInput
              testID="extracted-budget-field"
              style={styles.input}
              keyboardType="numeric"
              value={extracted.weekly_budget_ngn?.toString() || ''}
              onChangeText={(text) => handleEditField('weekly_budget_ngn', parseInt(text) || 0)}
            />
          </View>

          <TouchableOpacity 
            testID="screening-submit-button"
            style={styles.primaryButton}
            onPress={() => router.push('/(screening)/clinical-data-entry')}
          >
            <Text style={styles.buttonText}>Confirm & Continue</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setExtracted(null)}>
            <Text style={styles.secondaryButtonText}>Start Over</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>How are you feeling today?</Text>
          <Text style={styles.subtitle}>Describe your symptoms, diet, and weekly budget.</Text>
          
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.inputCard}>
            <TouchableOpacity 
              testID="mic-button"
              style={[styles.micButton, isListening && styles.micListening]} 
              onPress={isListening ? handleStopVoice : handleStartVoice}
            >
              <Text style={styles.micIcon}>{isListening ? '??' : '???'}</Text>
              <Text style={styles.micText}>{isListening ? 'Tap to stop...' : 'Tap to speak'}</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR TYPE INSTEAD</Text>
              <View style={styles.line} />
            </View>

            <TextInput
              testID="screening-text-input"
              style={styles.textArea}
              placeholder="E.g., I feel very tired and dizzy, budget is two thousand naira..."
              multiline
              numberOfLines={4}
              value={typedText}
              onChangeText={setTypedText}
            />
            
            <TouchableOpacity 
              style={[styles.primaryButton, !typedText.trim() && styles.disabledButton]} 
              onPress={handleSubmitText}
              disabled={!typedText.trim()}
            >
              <Text style={styles.buttonText}>Submit Text</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  micButton: {
    backgroundColor: '#EFF6FF',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  micListening: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  micIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  micText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A7F3D0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  }
});
