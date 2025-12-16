import React, { useState } from 'react';
import { generateMenuFromContext } from '../services/geminiService';
import { Ingredient, Preset, Restaurant } from '../types';
import { Globe, Loader2, Sparkles, ChefHat } from 'lucide-react';

interface MenuImporterProps {
  restaurant: Restaurant;
  onImport: (menu: Ingredient[], presets: Preset[]) => void;
}

export const MenuImporter: React.FC<MenuImporterProps> = ({ restaurant, onImport }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    // Simulate slight delay for "scraping" feel even if API is fast
    try {
      const data = await generateMenuFromContext(restaurant.name, url);
      if (data) {
        onImport(data.menu, data.presets);
      } else {
        alert("Failed to generate menu. Please try a different URL or description.");
      }
    } catch (error) {
      alert("Error contacting AI service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-stone-50 rounded-xl border border-dashed border-stone-300">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <Globe className="w-8 h-8 text-blue-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-stone-900 mb-2">Import Menu for {restaurant.name}</h2>
      <p className="text-stone-500 text-center max-w-md mb-8">
        We don't have this menu on file yet. Provide a URL or description, and our AI Agent will scrape and reconstruct the ordering options for you.
      </p>

      <form onSubmit={handleImport} className="w-full max-w-lg space-y-4">
        <div className="relative">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://... or paste menu text"
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full py-3 bg-stone-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Menu Structure...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Menu</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-8 flex items-center gap-2 text-xs text-stone-400">
        <ChefHat className="w-4 h-4" />
        <span>Powered by Gemini AI Semantic Scraping</span>
      </div>
    </div>
  );
};
