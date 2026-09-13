import { scheduleCheckIn, recordCheckInResponse } from '../src/services/monitoringService';
import { getFlaggedUsers } from '../src/services/healthWorkerService';
import { db } from '../src/db/sqlite';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'TIME_INTERVAL' }
}));

beforeEach(async () => {
  await db.reset();
});

test('check-in notification is scheduled after a screening', async () => {
  const screeningId = await db.insertScreening({ userId: 'test-user-1', riskBand: 'possible_risk' });
  const scheduled = await scheduleCheckIn(screeningId);
  expect(scheduled.triggerInDays).toBe(7);
});

test('check-in response is correctly linked to its screening', async () => {
  const screeningId = await db.insertScreening({ userId: 'test-user-1', riskBand: 'low_risk' });
  await recordCheckInResponse(screeningId, { followedPlan: true, budgetChanged: false });
  const record = await db.getCheckIn(screeningId);
  expect(record.followedPlan).toBe(true);
});

test('dashboard shows only possible_risk and elevated_risk users', async () => {
  await db.insertScreening({ userId: 'user-a', riskBand: 'low_risk' });
  await db.insertScreening({ userId: 'user-b', riskBand: 'possible_risk' });
  await db.insertScreening({ userId: 'user-c', riskBand: 'elevated_risk' });

  const flagged = await getFlaggedUsers();
  const flaggedIds = flagged.map((u: any) => u.userId);

  expect(flaggedIds).toContain('user-b');
  expect(flaggedIds).toContain('user-c');
  expect(flaggedIds).not.toContain('user-a');
});
