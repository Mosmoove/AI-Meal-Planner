
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, MealPlan, Recipe, ShoppingList } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    monday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } } },
    tuesday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } } },
    wednesday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } } },
    thursday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } } },
    friday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } } },
    saturday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } } },
    sunday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } } },
  },
};

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        cookTime: { type: Type.STRING, description: "e.g., '30 minutes'" },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                }
            }
        },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        nutrition: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.STRING },
                protein: { type: Type.STRING },
                carbs: { type: Type.STRING },
                fat: { type: Type.STRING },
            }
        },
    },
};

const shoppingListSchema = {
    type: Type.OBJECT,
    description: "An object where keys are grocery categories (e.g., 'Produce', 'Dairy & Eggs') and values are arrays of ingredient strings.",
    properties: {
        Produce: { type: Type.ARRAY, items: { type: Type.STRING } },
        'Dairy & Eggs': { type: Type.ARRAY, items: { type: Type.STRING } },
        'Meat & Seafood': { type: Type.ARRAY, items: { type: Type.STRING } },
        Pantry: { type: Type.ARRAY, items: { type: Type.STRING } },
        Bakery: { type: Type.ARRAY, items: { type: Type.STRING } },
        Frozen: { type: Type.ARRAY, items: { type: Type.STRING } },
        Other: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};


export const generateMealPlan = async (prefs: UserPreferences): Promise<MealPlan> => {
  const prompt = `Generate a 7-day meal plan based on these preferences:
  - Diet: ${prefs.diet}
  - Allergies: ${prefs.allergies || 'none'}
  - Preferred Cuisine: ${prefs.cuisine}
  - Number of People: ${prefs.people}
  - Budget: ${prefs.budget}

  Provide a creative and varied meal for breakfast, lunch, and dinner for each day of the week. Only provide the name of the meal for each slot.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: mealPlanSchema,
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MealPlan;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error("Failed to generate meal plan. Please check your API key and try again.");
  }
};

export const generateRecipeDetails = async (mealName: string): Promise<Recipe> => {
    const prompt = `Provide a detailed recipe for "${mealName}". Include a brief, appealing description, the total cook time, a list of ingredients with quantities, step-by-step instructions, and estimated nutritional information (calories, protein, carbs, fat).`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: recipeSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recipe;
    } catch (error) {
        console.error(`Error generating recipe for ${mealName}:`, error);
        throw new Error(`Failed to generate recipe for ${mealName}.`);
    }
};

export const generateShoppingList = async (mealPlan: MealPlan): Promise<ShoppingList> => {
    const allMeals = Object.values(mealPlan).flatMap(day => [day.breakfast, day.lunch, day.dinner]);
    const uniqueMeals = [...new Set(allMeals)];

    const prompt = `Based on the following list of meals for a week, generate a consolidated shopping list.
    Meals: ${uniqueMeals.join(', ')}.
    
    First, determine all the necessary ingredients for every meal. Then, consolidate the ingredients, summing up quantities where applicable (e.g., 2 eggs + 3 eggs = 5 eggs). Finally, group the consolidated ingredients into common grocery store categories (e.g., Produce, Dairy & Eggs, Meat & Seafood, Pantry, Bakery, Frozen, Other).
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: shoppingListSchema,
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ShoppingList;
    } catch (error) {
        console.error("Error generating shopping list:", error);
        throw new Error("Failed to generate shopping list.");
    }
};
