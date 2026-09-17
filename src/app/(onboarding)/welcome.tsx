import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to NutriGuard</Text>
        <Text style={styles.description}>
          AI-powered nutritional monitoring and anemia detection for mothers in Nigeria.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#059669',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: 'white',
    marginBottom: 20,
    lineHeight: 45
  },
  description: {
    fontSize: 18,
    color: '#dcfce7',
    lineHeight: 26,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#059669',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
