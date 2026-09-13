import { getMealPlan } from '../src/services/nutritionService';

describe('Nutrition Service', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns a meal plan when backend responds successfully', async () => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meal_plan: [{ day: 'Monday', meal: 'Beans', est_cost_ngn: 200 }] }),
      })
    ) as jest.Mock;

    const result = await getMealPlan({ weeklyBudgetNgn: 2000, symptoms: [], dietSummary: '' });
    expect(result.meal_plan.length).toBeGreaterThan(0);
  });

  test('does not throw when network request fails, and queues for retry', async () => {
    globalThis.fetch = jest.fn(() => Promise.reject(new Error('Network request failed'))) as jest.Mock;
    const queueSpy = jest.fn();

    await expect(
      getMealPlan({ weeklyBudgetNgn: 2000, symptoms: [], dietSummary: '' }, queueSpy)
    ).resolves.not.toThrow();

    expect(queueSpy).toHaveBeenCalled();
  });
});
