import { classifyMuac, classifyWhz, classifyWaz, classifyHaz, combineChildSignals } from '../src/services/anthropometricClassifier';

describe('MUAC classification (children 6-59 months)', () => {
  test('severe acute malnutrition', () => expect(classifyMuac(10.8, 24)).toBe('severe_acute_malnutrition'));
  test('moderate acute malnutrition', () => expect(classifyMuac(12.0, 24)).toBe('moderate_acute_malnutrition'));
  test('normal', () => expect(classifyMuac(13.5, 24)).toBe('normal'));
  test('boundary at 11.5cm is severe', () => expect(classifyMuac(11.5, 24)).toBe('severe_acute_malnutrition'));
});

describe('WHZ classification', () => {
  test('severe wasting', () => expect(classifyWhz(-3.2)).toBe('severe_wasting'));
  test('moderate wasting', () => expect(classifyWhz(-2.5)).toBe('moderate_wasting'));
  test('normal', () => expect(classifyWhz(-1.0)).toBe('normal'));
  test('boundary at exactly -3 is severe', () => expect(classifyWhz(-3.0)).toBe('severe_wasting'));
  test('boundary at exactly -2 is normal', () => expect(classifyWhz(-2.0)).toBe('normal'));
});

describe('WAZ and HAZ use the same threshold pattern as WHZ', () => {
  test('WAZ severe', () => expect(classifyWaz(-3.5)).toBe('severely_underweight'));
  test('HAZ moderate', () => expect(classifyHaz(-2.3)).toBe('stunted'));
});

test('manual clinical data overrides photo-based estimate when both present', () => {
  const combined = combineChildSignals(
    { source: 'photo_model', category: 'healthy', confidence: 0.6 },
    { muacCm: 10.8, ageMonths: 24 }
  );
  expect(combined.finalCategory).toBe('severe_acute_malnutrition');
  expect(combined.source).toBe('manual_clinical_entry');
});
