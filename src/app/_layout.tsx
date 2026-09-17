import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(screening)" />
        <Stack.Screen name="(nutrition)" />
        <Stack.Screen name="(monitoring)" />
        <Stack.Screen name="(health-worker)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
