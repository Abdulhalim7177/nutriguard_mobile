import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: '#059669',
      tabBarInactiveTintColor: '#6b7280',
      tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 5 }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="scan" 
        options={{
          title: 'AI Scan',
          tabBarIcon: ({ color }) => <Ionicons name="scan-circle" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="nutrition" 
        options={{
          title: 'Meal Plan',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}
