import { apiClient } from './api';
import { queueRequest } from './syncService';

interface NutritionRequest {
  weeklyBudgetNgn: number;
  symptoms: string[];
  dietSummary: string;
}

export const getMealPlan = async (
  payload: NutritionRequest,
  queueMock?: (endpoint: string, payload: any) => Promise<void>
) => {
  try {
    const data = await apiClient('/nutrition/recommend', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    console.warn('Network request failed, queuing for sync offline...', error);
    
    const queueFunc = queueMock || queueRequest;
    await queueFunc('/nutrition/recommend', payload);
    
    // Return null or a generic fallback object to let the UI know it is offline
    return null;
  }
};
