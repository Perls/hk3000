import React, { useState } from 'react';
import { generateMenuFromContext } from '../services/geminiService';
import { Ingredient, Preset, Restaurant } from '../types';
import { Globe, Loader2, Sparkles, ChefHat, Layers } from 'lucide-react';

interface MenuImporterProps {
  restaurant: Restaurant;
  onImport: (menu: Ingredient[], presets: Preset[]) => void;
}

export const MenuImporter: React.FC<MenuImporterProps> = ({ restaurant, onImport }) => {
  const [url, setUrl] = useState('');
  const [loadingMode, setLoadingMode] = useState<'standard' | 'deep' | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleImport = async (mode: 'standard' | 'deep') => {
    if (!url.trim()) return;

    setLoadingMode(mode);
    setStatusMsg("Connecting to Gemini...");

    try {
      if (mode === 'deep' || url.startsWith('http')) {
        setStatusMsg("Browsing Google Index...");
      } else {
        setStatusMsg("Analyzing text...");
      }

      // Small artificial delay to let the user see the status change if it's instant
      await new Promise(r => setTimeout(r, 500));

      const data = await generateMenuFromContext(restaurant.name, url, mode);
      
      if (data) {
        setStatusMsg("Constructing menu...");
        onImport(data.menu, data.presets);
      } else {
        alert("Failed to reconstruct menu. Try being more specific or using a different URL.");
        setStatusMsg("");
      }
    } catch (error) {
      console.error(error);
      alert("Error contacting AI service.");
      setStatusMsg("");
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 bg-stone-50 rounded-xl border border-dashed border-stone-300">
      <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
        <Globe className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 text-center">Import Menu for {restaurant.name}</h2>
      <p className="text-sm md:text-base text-stone-500 text-center max-w-md mb-6 md:mb-8">
        We don't have this menu on file yet. Provide a URL or description, and our AI Agent will search, scrape, and reconstruct the ordering options for you.
      </p>

      <div className="w-full max-w-lg space-y-3 md:space-y-4">
        <div className="relative">
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://... or paste menu text"
            className="w-full px-3 py-2.5 md:px-4 md:py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm md:text-base"
            disabled={loadingMode !== null}
          />
        </div>

        {loadingMode && (
          <div className="text-center text-xs md:text-sm text-blue-600 font-medium animate-pulse mb-2">
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            <button 
              onClick={() => handleImport('standard')}
              disabled={loadingMode !== null || !url.trim()}
              className="py-2.5 md:py-3 bg-stone-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-50 transition-all text-sm md:text-base"
            >
              {loadingMode === 'standard' ? (
                <>
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Quick Import</span>
                </>
              )}
            </button>

            <button 
              onClick={() => handleImport('deep')}
              disabled={loadingMode !== null || !url.trim()}
              className="py-2.5 md:py-3 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all border border-blue-800 text-sm md:text-base"
            >
              {loadingMode === 'deep' ? (
                <>
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                  <span>Deep Crawling...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Deep Scan & Construct</span>
                </>
              )}
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
