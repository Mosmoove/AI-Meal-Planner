
import React, { useState } from 'react';
import { MealPlan, ShoppingList as ShoppingListType } from '../types';
import { generateShoppingList } from '../services/geminiService';
import Spinner from './Spinner';

interface ShoppingListProps {
  mealPlan: MealPlan | null;
  shoppingList: ShoppingListType | null;
  setShoppingList: (list: ShoppingListType | null) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ mealPlan, shoppingList, setShoppingList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleGenerateList = async () => {
    if (!mealPlan) return;
    setIsLoading(true);
    setError(null);
    setShoppingList(null);
    setCheckedItems({});
    try {
      const list = await generateShoppingList(mealPlan);
      setShoppingList(list);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (item: string) => {
    setCheckedItems(prev => ({...prev, [item]: !prev[item]}));
  };

  if (!mealPlan) {
    return (
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-neutral mb-2">No Meal Plan Found</h2>
        <p className="text-gray-600">Please generate a meal plan first to create your shopping list.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-neutral mb-4">Your Shopping List</h2>
        <p className="text-gray-600 mb-6">Generate a consolidated shopping list from your weekly meal plan.</p>
        <button
          onClick={handleGenerateList}
          disabled={isLoading}
          className="bg-secondary hover:bg-secondary-focus text-white font-bold py-2.5 px-6 rounded-lg flex items-center justify-center transition duration-300 disabled:bg-gray-400 w-full sm:w-auto mx-auto"
        >
          {isLoading ? <Spinner /> : 'Generate Shopping List'}
        </button>
      </div>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}

      {shoppingList && (
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-slide-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(shoppingList).map(([category, items]) => (
              <div key={category} className="bg-base-100 p-4 rounded-xl border border-base-200">
                <h3 className="font-bold text-lg text-secondary mb-3">{category}</h3>
                <ul className="space-y-2">
                  {/* FIX: Add Array.isArray check as a type guard to fix TypeScript error where 'items' was inferred as 'unknown'. */}
                  {Array.isArray(items) && items.map((item, index) => (
                    <li key={`${category}-${index}`} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`${category}-${index}`}
                        checked={!!checkedItems[item]}
                        onChange={() => handleCheckboxChange(item)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                      />
                      <label 
                        htmlFor={`${category}-${index}`} 
                        className={`ml-3 text-sm text-neutral ${checkedItems[item] ? 'line-through text-gray-400' : ''}`}
                      >
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
