import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="leaf" size={48} color="#2E5C31" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>NutriGuard</Text>
          <Text style={styles.subtitle}>
            Detect. Understand. Recommend. Monitor. Act.
          </Text>
          
          <Text style={styles.description}>
            A voice-based digital assistant that helps pregnant and postpartum women, families, and health workers catch nutrition and anaemia risk early.
          </Text>

          <View style={styles.featureList}>
             <View style={styles.featureItem}>
               <Ionicons name="checkmark-circle" size={20} color="#FF7A45" />
               <Text style={styles.featureText}>Early Risk Detection</Text>
             </View>
             <View style={styles.featureItem}>
               <Ionicons name="checkmark-circle" size={20} color="#FF7A45" />
               <Text style={styles.featureText}>Affordable Meal Guidance</Text>
             </View>
             <View style={styles.featureItem}>
               <Ionicons name="checkmark-circle" size={20} color="#FF7A45" />
               <Text style={styles.featureText}>Local Nigerian Foods</Text>
             </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2E5C31',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF7A45',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 32,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  bottomSection: {
    marginTop: 40,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#2E5C31',
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#2E5C31',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  }
});
