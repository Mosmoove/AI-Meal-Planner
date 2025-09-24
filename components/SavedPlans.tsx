import React, { useState, useEffect } from 'react';
import { getSavedPlans, deletePlan } from '../services/storageService';
import { MealPlan, Recipe, SavedMealPlan, View } from '../types';

interface SavedPlansProps {
    setMealPlan: (plan: MealPlan) => void;
    setRecipes: (recipes: Record<string, Recipe>) => void;
    setView: (view: View) => void;
}

const SavedPlans: React.FC<SavedPlansProps> = ({ setMealPlan, setRecipes, setView }) => {
    const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);

    useEffect(() => {
        setSavedPlans(getSavedPlans().reverse()); // Show newest first
    }, []);

    const handleLoadPlan = (plan: SavedMealPlan) => {
        setMealPlan(plan.plan);
        setRecipes(plan.recipes);
        setView(View.MEAL_PLANNER);
    };

    const handleDeletePlan = (id: string) => {
        if (window.confirm('Are you sure you want to delete this meal plan?')) {
            deletePlan(id);
            setSavedPlans(prevPlans => prevPlans.filter(p => p.id !== id));
        }
    };

    if (savedPlans.length === 0) {
        return (
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold text-neutral mb-2">No Saved Plans Yet</h2>
                <p className="text-gray-600">Generate a meal plan and click "Save Plan" to see it here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-neutral mb-4">Your Saved Meal Plans</h2>
                <p className="text-gray-600">Here are all the meal plans you've saved. Load one to view details or generate a shopping list.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlans.map(plan => (
                    <div key={plan.id} className="bg-white p-5 rounded-2xl shadow-lg flex flex-col justify-between border border-gray-200 animate-slide-in-up">
                        <div>
                            <p className="font-bold text-lg text-neutral">Meal Plan</p>
                            <p className="text-sm text-gray-500 mb-4">Saved on: {plan.savedAt}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={() => handleLoadPlan(plan)}
                                className="w-full bg-primary hover:bg-primary-focus text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                                Load Plan
                            </button>
                            <button
                                onClick={() => handleDeletePlan(plan.id)}
                                className="w-full bg-error hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedPlans;
