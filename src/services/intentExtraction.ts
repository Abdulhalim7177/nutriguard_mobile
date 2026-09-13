export interface ExtractedIntent {
  symptoms: string[];
  pregnancy_stage: string;
  diet_summary: string;
  weekly_budget_ngn: number | null;
  language_detected: string;
  input_method?: string;
  confidence: number;
}

export function extractIntent(text: string): ExtractedIntent {
  const lowerText = text.toLowerCase();
  const result: ExtractedIntent = {
    symptoms: [],
    pregnancy_stage: 'unknown',
    diet_summary: '',
    weekly_budget_ngn: null,
    language_detected: 'en',
    confidence: 0.8
  };

  // 1. Extract budget
  const budgetMatch = lowerText.match(/(?:budget|budget is|have).*?(\d+)/i);
  if (budgetMatch && budgetMatch[1]) {
    result.weekly_budget_ngn = parseInt(budgetMatch[1], 10);
  } else {
    // try word numbers (hackathon level)
    if (lowerText.includes('two thousand')) result.weekly_budget_ngn = 2000;
    else if (lowerText.includes('one thousand five hundred') || lowerText.includes('1500')) result.weekly_budget_ngn = 1500;
    else if (lowerText.includes('one thousand')) result.weekly_budget_ngn = 1000;
  }

  // 2. Extract symptoms
  const symptomKeywords = {
    'fatigue': ['tired', 'fatigue', 'gajiya'],
    'dizziness': ['dizzy', 'dizziness', 'jiri'],
    'headache': ['headache', 'ciwon kai'],
    'pale_gums': ['pale', 'fari'],
  };

  for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
    for (const kw of keywords) {
      if (lowerText.includes(kw)) {
        if (!result.symptoms.includes(symptom)) {
          result.symptoms.push(symptom);
        }
      }
    }
  }

  // 3. Extract diet
  if (lowerText.includes('rice') || lowerText.includes('stew') || lowerText.includes('beans')) {
    result.diet_summary = lowerText.split(',').find(part => part.includes('rice') || part.includes('stew') || part.includes('beans'))?.trim() || '';
  }

  return result;
}
