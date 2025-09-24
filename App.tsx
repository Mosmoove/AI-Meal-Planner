import React, { useState } from 'react';
import Header from './components/Header';
import MealPlanner from './components/MealPlanner';
import ShoppingList from './components/ShoppingList';
import SavedPlans from './components/SavedPlans';
import { MealPlan, Recipe, ShoppingList as ShoppingListType, View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.MEAL_PLANNER);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListType | null>(null);
  const [recipes, setRecipes] = useState<Record<string, Recipe>>({});

  const renderView = () => {
    switch (view) {
      case View.MEAL_PLANNER:
        return (
          <MealPlanner 
            setMealPlan={setMealPlan} 
            mealPlan={mealPlan}
            recipes={recipes}
            setRecipes={setRecipes}
          />
        );
      case View.SHOPPING_LIST:
        return (
          <ShoppingList 
            mealPlan={mealPlan} 
            shoppingList={shoppingList}
            setShoppingList={setShoppingList}
          />
        );
      case View.SAVED_PLANS:
        return (
          <SavedPlans 
            setMealPlan={setMealPlan}
            setRecipes={setRecipes}
            setView={setView}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-base-100 font-sans text-neutral">
      <Header activeView={view} setView={setView} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>Powered by Gemini API. Built for modern meal planning.</p>
      </footer>
    </div>
  );
};

export default App;