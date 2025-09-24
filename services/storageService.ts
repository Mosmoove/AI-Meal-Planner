import { MealPlan, Recipe, SavedMealPlan } from '../types';

const STORAGE_KEY = 'ai-meal-plans';

export const getSavedPlans = (): SavedMealPlan[] => {
  try {
    const savedPlansJson = localStorage.getItem(STORAGE_KEY);
    return savedPlansJson ? JSON.parse(savedPlansJson) : [];
  } catch (error) {
    console.error("Failed to parse saved meal plans from localStorage", error);
    return [];
  }
};

export const savePlan = (plan: MealPlan, recipes: Record<string, Recipe>): SavedMealPlan => {
  const savedPlans = getSavedPlans();
  const newSavedPlan: SavedMealPlan = {
    id: new Date().toISOString(),
    savedAt: new Date().toLocaleString(),
    plan,
    recipes,
  };
  
  const updatedPlans = [...savedPlans, newSavedPlan];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  return newSavedPlan;
};

export const deletePlan = (id: string): void => {
  const savedPlans = getSavedPlans();
  const updatedPlans = savedPlans.filter(plan => plan.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
};
