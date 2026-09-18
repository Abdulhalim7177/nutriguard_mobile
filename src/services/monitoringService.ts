import { db } from '../db/sqlite';
import { Platform } from 'react-native';

// In Expo Go SDK 53, expo-notifications crashes on import for Android.
// We will mock this functionality.
export const scheduleCheckIn = async (screeningId: number) => {
  const triggerInDays = 7;
  console.warn("Notifications are not supported in Expo Go on SDK 53 Android. Check-in scheduled virtually.");
  return { scheduled: true, triggerInDays };
};

export const recordCheckInResponse = async (
  screeningId: number, 
  response: { followedPlan: boolean, budgetChanged: boolean }
) => {
  await db.insertCheckIn(screeningId, response.followedPlan, response.budgetChanged);
};
