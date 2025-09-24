
import React, { useEffect, useState } from 'react';
import { generateRecipeDetails } from '../services/geminiService';
import { Recipe } from '../types';
import Spinner from './Spinner';

interface RecipeModalProps {
  mealName: string;
  onClose: () => void;
  recipes: Record<string, Recipe>;
  setRecipes: (recipes: Record<string, Recipe>) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ mealName, onClose, recipes, setRecipes }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(recipes[mealName] || null);
  const [isLoading, setIsLoading] = useState(!recipes[mealName]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (recipes[mealName]) {
        setRecipe(recipes[mealName]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const details = await generateRecipeDetails(mealName);
        setRecipe(details);
        setRecipes({ ...recipes, [mealName]: details });
      } catch (err: any) {
        setError(err.message || 'Failed to load recipe.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealName]);
  
  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral">{mealName}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {isLoading && <div className="flex justify-center items-center h-64"><Spinner /></div>}
          {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
          
          {recipe && (
            <div className="space-y-6 animate-slide-in-up">
              <p className="text-gray-600">{recipe.description}</p>
              
              <div className="flex items-center justify-around bg-base-100 p-4 rounded-xl text-center">
                <div>
                  <p className="text-sm text-gray-500">Cook Time</p>
                  <p className="font-bold text-primary">{recipe.cookTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-bold text-primary">{recipe.nutrition.calories}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Protein</p>
                  <p className="font-bold text-primary">{recipe.nutrition.protein}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-neutral">Ingredients</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700">
                    {recipe.ingredients.map((ing, index) => <li key={index}><span className="font-medium">{ing.quantity}</span> {ing.name}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-neutral">Instructions</h3>
                  <ol className="space-y-3 list-decimal list-inside text-gray-700">
                    {recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
