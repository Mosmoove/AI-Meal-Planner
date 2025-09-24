import React from 'react';
import { View } from '../types';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { ListIcon } from './icons/ListIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface HeaderProps {
  activeView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setView }) => {
  const getButtonClasses = (view: View) => {
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
    if (activeView === view) {
      return `${baseClasses} bg-primary text-primary-content shadow-md scale-105`;
    }
    return `${baseClasses} bg-base-200 text-neutral hover:bg-base-300 hover:text-black`;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <ChefHatIcon className="w-8 h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral tracking-tight">
            AI Meal Planner <span className="text-primary">Pro</span>
          </h1>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4 p-1 bg-base-200 rounded-xl">
          <button
            onClick={() => setView(View.MEAL_PLANNER)}
            className={getButtonClasses(View.MEAL_PLANNER)}
            aria-current={activeView === View.MEAL_PLANNER}
          >
            <ChefHatIcon className="w-5 h-5" />
            <span>Meal Planner</span>
          </button>
          <button
            onClick={() => setView(View.SHOPPING_LIST)}
            className={getButtonClasses(View.SHOPPING_LIST)}
            aria-current={activeView === View.SHOPPING_LIST}
          >
            <ListIcon className="w-5 h-5" />
            <span>Shopping List</span>
          </button>
           <button
            onClick={() => setView(View.SAVED_PLANS)}
            className={getButtonClasses(View.SAVED_PLANS)}
            aria-current={activeView === View.SAVED_PLANS}
          >
            <BookmarkIcon className="w-5 h-5" />
            <span>Saved</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;