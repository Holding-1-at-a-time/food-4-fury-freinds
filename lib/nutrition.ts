// This is a mock nutrition API. In a real application, you'd integrate with an actual API.
const mockNutritionData: { [key: string]: { calories: number, protein: number, fat: number, carbs: number } } = {
  'chicken': { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
  'rice': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
  'carrot': { calories: 41, protein: 0.9, fat: 0.2, carbs: 10 },
  'apple': { calories: 52, protein: 0.3, fat: 0.2, carbs: 14 },
};

export async function getNutritionInfo(ingredient: string): Promise<{ calories: number, protein: number, fat: number, carbs: number } | null> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockNutritionData[ingredient.toLowerCase()] || null;
}

export async function calculateRecipeNutrition(ingredients: string[]): Promise<{ calories: number, protein: number, fat: number, carbs: number }> {
  let totalNutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 };

  for (const ingredient of ingredients) {
    const nutrition = await getNutritionInfo(ingredient);
    if (nutrition) {
      totalNutrition.calories += nutrition.calories;
      totalNutrition.protein += nutrition.protein;
      totalNutrition.fat += nutrition.fat;
      totalNutrition.carbs += nutrition.carbs;
    }
  }

  return totalNutrition;
}