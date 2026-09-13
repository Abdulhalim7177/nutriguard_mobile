import { classifyMuac, classifyWhz, classifyWaz, classifyHaz, combineChildSignals } from './src/services/anthropometricClassifier';

console.log('Testing MUAC 10.8cm (24mo):', classifyMuac(10.8, 24));
console.log('Testing WHZ -2.5:', classifyWhz(-2.5));
console.log('Testing WHZ -1.0:', classifyWhz(-1.0));

const combined = combineChildSignals(
  { source: 'photo_model', category: 'healthy', confidence: 0.6 },
  { muacCm: 10.8, ageMonths: 24 }
);
console.log('Testing Combine:', combined.finalCategory, combined.source);
