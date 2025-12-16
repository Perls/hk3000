
import React, { useState } from 'react';
import { Restaurant } from '../types';
import { Globe, Loader2, Sparkles, ChefHat, Layers, ArrowLeft } from 'lucide-react';

interface MenuImporterProps {
  restaurant: Restaurant;
  onStartScrape: (url: string, mode: 'standard' | 'deep') => void;
  onCancel?: () => void;
  isScraping?: boolean;
}

export const MenuImporter: React.FC<MenuImporterProps> = ({ restaurant, onStartScrape, onCancel, isScraping }) => {
  const [url, setUrl] = useState('');

  const handleStart = (mode: 'standard' | 'deep') => {
      if (!url.trim() && !confirm("No URL provided. Do you want AI to generate a menu from general knowledge?")) {
        return;
      }
      onStartScrape(url, mode);
  };

  if (isScraping) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-stone-50 rounded-xl border border-dashed border-stone-300">
             <div className="relative w-16 h-16 mb-6">
                 <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                 <Globe className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
             </div>
             <h2 className="text-xl font-bold text-stone-900 mb-2">Analysing {restaurant.name}...</h2>
             <p className="text-stone-500 text-center text-sm max-w-xs mb-6">
                 The AI is currently browsing the web and structuring the menu data. This process happens in the background.
             </p>
             <button onClick={onCancel} className="px-6 py-2 bg-white border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 font-medium text-sm">
                 Go Back / Browse Other Items
             </button>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 bg-stone-50 rounded-xl border border-dashed border-stone-300 relative">
      {onCancel && (
          <button onClick={onCancel} className="absolute top-4 left-4 text-stone-400 hover:text-stone-600 flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
      )}

      <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
        <Globe className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 text-center">Import Menu for {restaurant.name}</h2>
      <p className="text-sm md:text-base text-stone-500 text-center max-w-md mb-6 md:mb-8">
        We don't have this menu on file yet. Provide a URL, or leave blank to let the AI generate it from general knowledge.
      </p>

      <div className="w-full max-w-lg space-y-3 md:space-y-4">
        <div className="relative">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Optional: https://..."
            className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm md:text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            <button 
              onClick={() => handleStart('standard')}
              className="py-2.5 md:py-3 bg-stone-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all text-sm md:text-base"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <span>Standard Generate</span>
            </button>

            <button 
              onClick={() => handleStart('deep')}
              className="py-2.5 md:py-3 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all border border-blue-800 text-sm md:text-base"
            >
              <Layers className="w-4 h-4 md:w-5 md:h-5" />
              <span>Deep Search & Build</span>
            </button>
        </div>
      </div>
      
      <div className="mt-6 md:mt-8 flex items-center gap-2 text-xs text-stone-400">
        <ChefHat className="w-4 h-4" />
        <span>Powered by Gemini AI Semantic Scraping</span>
      </div>
    </div>
  );
};
