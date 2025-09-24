export enum View {
  MEAL_PLANNER = 'MEAL_PLANNER',
  SHOPPING_LIST = 'SHOPPING_LIST',
  SAVED_PLANS = 'SAVED_PLANS',
}

export interface UserPreferences {
  diet: string;
  allergies: string;
  cuisine: string;
  people: number;
  budget: string;
}

export interface Meal {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MealPlan {
  monday: Meal;
  tuesday: Meal;
  wednesday: Meal;
  thursday: Meal;
  friday: Meal;
  saturday: Meal;
  sunday: Meal;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  name: string;
  description: string;
  cookTime: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
}

export interface ShoppingList {
  [category: string]: string[];
}

export interface SavedMealPlan {
  id: string;
  savedAt: string;
  plan: MealPlan;
  recipes: Record<string, Recipe>;
}