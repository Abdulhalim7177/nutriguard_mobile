import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(screening)" />
        <Stack.Screen name="(nutrition)" />
        <Stack.Screen name="(monitoring)" />
        <Stack.Screen name="(health-worker)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
