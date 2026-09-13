import { runAnemiaInference } from '../src/ml/anemiaInference';
import { mapRiskToMessage } from '../src/app/(screening)/risk-result';

const FORBIDDEN_PHRASES = ['you have anemia', 'you have anaemia', 'diagnosed with', 'confirmed anemia'];

test('model loads and returns a valid risk band', async () => {
  const result = await runAnemiaInference('test-assets/sample_conjunctiva.jpg');
  expect(['low_risk', 'possible_risk', 'elevated_risk']).toContain(result.riskBand);
  expect(result.confidence).toBeGreaterThanOrEqual(0);
  expect(result.confidence).toBeLessThanOrEqual(1);
});

test('messaging never contains diagnostic language', () => {
  ['low_risk', 'possible_risk', 'elevated_risk'].forEach((band) => {
    const message = mapRiskToMessage(band).toLowerCase();
    FORBIDDEN_PHRASES.forEach((phrase) => {
      expect(message).not.toContain(phrase);
    });
  });
});

test('inference runs with network disabled (offline check)', async () => {
  // simulate offline by mocking fetch to throw
  globalThis.fetch = () => { throw new Error('network should not be called'); };
  const result = await runAnemiaInference('test-assets/sample_conjunctiva.jpg');
  expect(result).toBeDefined();
});
