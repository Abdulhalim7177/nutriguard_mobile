import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../src/app/index';

const expectedRoutes = [
  '(onboarding)/welcome',
  '(screening)/voice-intake',
  '(screening)/clinical-data-entry',
  '(screening)/photo-check',
  '(screening)/risk-result',
  '(nutrition)/meal-plan',
  '(monitoring)/check-in',
  '(health-worker)/dashboard',
];

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

test('home screen renders without crashing', () => {
  const { toJSON } = render(<HomeScreen />);
  expect(toJSON()).not.toBeNull();
});

test('all expected route files exist', () => {
  expectedRoutes.forEach((route) => {
    // We adjust path to look into src/app
    expect(() => require(../src/app/ + route)).not.toThrow();
  });
});
