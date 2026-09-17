import { Redirect } from 'expo-router';
// In a real app, you would check AsyncStorage to see if the user is logged in
// For now, we redirect them to the Tabs dashboard, or Onboarding. Let's redirect to Onboarding.
export default function Index() {
  return <Redirect href="/(onboarding)/welcome" />;
}
