import React, { useState } from 'react';
import { generateMealPlan } from '../services/geminiService';
import { savePlan } from '../services/storageService';
import { MealPlan, UserPreferences, Recipe } from '../types';
import { DIET_OPTIONS, CUISINE_OPTIONS, BUDGET_OPTIONS, DAYS_OF_WEEK } from '../constants';
import Spinner from './Spinner';
import RecipeModal from './RecipeModal';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface MealPlannerProps {
  mealPlan: MealPlan | null;
  setMealPlan: (plan: MealPlan | null) => void;
  recipes: Record<string, Recipe>;
  setRecipes: (recipes: Record<string, Recipe>) => void;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ mealPlan, setMealPlan, recipes, setRecipes }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    diet: DIET_OPTIONS[0],
    allergies: '',
    cuisine: CUISINE_OPTIONS[0],
    people: 2,
    budget: BUDGET_OPTIONS[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [isPlanSaved, setIsPlanSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: name === 'people' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMealPlan(null);
    setRecipes({});
    setIsPlanSaved(false);
    try {
      const plan = await generateMealPlan(preferences);
      setMealPlan(plan);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMealClick = (mealName: string) => {
    if (mealName && mealName.toLowerCase() !== 'leftovers') {
        setSelectedMeal(mealName);
    }
  };

  const handleSavePlan = () => {
    if (mealPlan) {
      savePlan(mealPlan, recipes);
      setIsPlanSaved(true);
      setTimeout(() => setIsPlanSaved(false), 2000); // Hide message after 2 seconds
    }
  };

  const closeModal = () => {
    setSelectedMeal(null);
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-neutral mb-4">Create Your Weekly Meal Plan</h2>
        <p className="text-gray-600 mb-6">Tell us your preferences, and our AI will craft a delicious and personalized meal plan just for you.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Form fields */}
          <div>
            <label htmlFor="diet" className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
            <select id="diet" name="diet" value={preferences.diet} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-base-100 text-neutral">
              {DIET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">Preferred Cuisine</label>
            <select id="cuisine" name="cuisine" value={preferences.cuisine} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-base-100 text-neutral">
              {CUISINE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
            <select id="budget" name="budget" value={preferences.budget} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-base-100 text-neutral">
              {BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">Allergies (comma separated)</label>
            <input type="text" id="allergies" name="allergies" value={preferences.allergies} onChange={handleInputChange} placeholder="e.g., peanuts, shellfish" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-base-100 text-neutral placeholder:text-gray-500" />
          </div>
          <div>
            <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
            <input type="number" id="people" name="people" value={preferences.people} min="1" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-base-100 text-neutral" />
          </div>
          <div className="md:col-span-2 lg:col-span-1 flex items-end">
            <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition duration-300 disabled:bg-gray-400">
              {isLoading ? <Spinner /> : 'Generate Plan'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}

      {mealPlan && (
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral">Your Personal Meal Plan</h2>
            <button 
              onClick={handleSavePlan}
              className="bg-accent hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-300"
            >
              <BookmarkIcon className="w-5 h-5" />
              <span>{isPlanSaved ? 'Plan Saved!' : 'Save Plan'}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="bg-base-100 p-4 rounded-xl border border-base-200">
                <h3 className="font-bold text-lg capitalize text-center text-primary mb-3">{day}</h3>
                <div className="space-y-3">
                  {Object.entries((mealPlan as any)[day]).map(([mealType, mealName]) => (
                    <div key={mealType} className="text-sm">
                      <p className="font-semibold text-gray-500 capitalize">{mealType}</p>
                      <button 
                        onClick={() => handleMealClick(mealName as string)} 
                        className="text-left w-full font-medium text-neutral hover:text-secondary transition duration-200 p-1 rounded disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={!mealName || (mealName as string).toLowerCase().includes('leftover')}
                      >
                        {mealName as string}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedMeal && (
        <RecipeModal
          mealName={selectedMeal}
          onClose={closeModal}
          recipes={recipes}
          setRecipes={setRecipes}
        />
      )}
    </div>
  );
};

export default MealPlanner;