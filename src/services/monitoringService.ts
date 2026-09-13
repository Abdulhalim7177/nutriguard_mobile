import * as Notifications from 'expo-notifications';
import { db } from '../db/sqlite';

export const scheduleCheckIn = async (screeningId: number) => {
  const triggerInDays = 7;
  const triggerSeconds = triggerInDays * 24 * 60 * 60;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'NutriGuard Weekly Check-in ??',
      body: 'Hi! Were you able to follow your meal plan this week? Tap to update us.',
      data: { screeningId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: triggerSeconds, 
    },
  });
  
  return { scheduled: true, triggerInDays };
};

export const recordCheckInResponse = async (
  screeningId: number, 
  response: { followedPlan: boolean, budgetChanged: boolean }
) => {
  await db.insertCheckIn(screeningId, response.followedPlan, response.budgetChanged);
};
