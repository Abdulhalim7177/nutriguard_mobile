import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: '#2E5C31',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarShowLabel: true,
      tabBarStyle: { 
        height: Platform.OS === 'ios' ? 78 : 60, 
        paddingBottom: Platform.OS === 'ios' ? 20 : 8, 
        paddingTop: 8,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      headerStyle: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      },
      headerTitleStyle: {
        fontWeight: '800',
        color: '#2E5C31',
      }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="checkin" 
        options={{
          title: 'Check-In',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="nutrition" 
        options={{
          title: 'Meals',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="community" 
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="more" 
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}
