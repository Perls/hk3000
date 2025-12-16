
import React, { useState } from 'react';
import { Sparkles, Send, Loader2, MessageSquare, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { parseNaturalLanguageOrder, getRestaurantRecommendation } from '../services/geminiService';
import { AIOrderSuggestion, Ingredient, Restaurant } from '../types';

interface GeminiAssistantProps {
  // Common Props
  variant?: 'embedded' | 'floating'; // Embedded (in Builder) or Floating (in Home)
  scope?: 'restaurant' | 'global';
  
  // Restaurant Scope Props
  onApplySuggestion?: (suggestion: AIOrderSuggestion) => void;
  menu?: Ingredient[];
  restaurantName?: string;

  // Global Scope Props
  restaurants?: Restaurant[];
  onSelectRestaurant?: (id: string) => void;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ 
  variant = 'embedded',
  scope = 'restaurant',
  onApplySuggestion, 
  menu = [], 
  restaurantName = 'Restaurant',
  restaurants = [],
  onSelectRestaurant
}) => {
  const [isOpen, setIsOpen] = useState(variant === 'embedded'); // Floating starts closed usually
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [suggestedRestId, setSuggestedRestId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponseMessage(null);
    setSuggestedRestId(null);

    try {
      if (scope === 'restaurant') {
        // Order Building Mode
        const suggestion = await parseNaturalLanguageOrder(input, menu, restaurantName);
        if (suggestion) {
          if (onApplySuggestion) onApplySuggestion(suggestion);
          setResponseMessage(suggestion.reasoning); // Show the reasoning as chat response
          setInput('');
        } else {
          setError("I couldn't quite understand that. Try being more specific about flavors.");
        }
      } else {
        // Global Recommendation Mode
        const rec = await getRestaurantRecommendation(input, restaurants);
        if (rec) {
          setResponseMessage(rec.text);
          if (rec.suggestedRestaurantId) {
             setSuggestedRestId(rec.suggestedRestaurantId);
          }
          setInput('');
        } else {
          setError("I'm having trouble connecting to the concierge service.");
        }
      }
    } catch (err) {
      setError("Something went wrong with the AI service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecommendation = () => {
    if (suggestedRestId && onSelectRestaurant) {
      onSelectRestaurant(suggestedRestId);
    }
  };

  // --- Render Logic ---

  // Floating Button (Collapsed State)
  if (variant === 'floating' && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all hover:scale-105 z-50 flex items-center gap-2"
      >
        <span className="text-2xl">👨‍🍳</span>
        <span className="font-bold hidden md:inline">Ask AI Chef</span>
      </button>
    );
  }

  // Container Classes
  const containerClasses = variant === 'floating' 
    ? "fixed bottom-6 right-6 md:bottom-8 md:right-8 w-[90vw] md:w-96 bg-white shadow-2xl z-50 rounded-2xl border border-indigo-100 flex flex-col max-h-[60vh]"
    : "bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 h-full flex flex-col";

  return (
    <div className={containerClasses}>
      
      {/* Header */}
      <div className={`flex items-center justify-between ${variant === 'floating' ? 'p-4 border-b border-indigo-50 bg-indigo-50/50 rounded-t-2xl' : 'mb-2'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">👨‍🍳</span>
          <div>
            <h3 className="font-bold text-indigo-900 leading-tight">AI Chef</h3>
            {variant === 'floating' && <p className="text-[10px] text-indigo-500 font-medium">Concierge & Guide</p>}
          </div>
        </div>
        
        {variant === 'floating' && (
          <button onClick={() => setIsOpen(false)} className="text-indigo-400 hover:text-indigo-700">
             <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Body Content */}
      <div className={`flex-1 overflow-y-auto ${variant === 'floating' ? 'p-4' : ''}`}>
         {variant === 'embedded' && (
             <>
                <p className="text-sm text-indigo-800 font-medium mb-1">
                    Ask AI for help with your order
                </p>
                <p className="text-xs text-indigo-500 mb-4 leading-relaxed">
                    You can ask the AI for help with any question about your order, or have them even build your order after a few ideas from you.
                </p>
             </>
         )}

         {/* Chat Area */}
         {(responseMessage || error) && (
             <div className="mb-4 space-y-2">
                 {responseMessage && (
                     <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm text-sm text-indigo-900">
                         {responseMessage}
                         {suggestedRestId && variant === 'floating' && (
                           <button 
                              onClick={handleSelectRecommendation}
                              className="mt-2 flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                           >
                              Go to Restaurant <ArrowRight className="w-3 h-3" />
                           </button>
                         )}
                     </div>
                 )}
                 {error && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                        {error}
                    </div>
                 )}
             </div>
         )}
      </div>

      {/* Input Area */}
      <div className={variant === 'floating' ? 'p-4 border-t border-indigo-50' : ''}>
          <form onSubmit={handleSubmit} className="relative">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={scope === 'global' ? "Where can I get tacos?" : "e.g. Is the chicken spicy?"}
            className="w-full pl-4 pr-12 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
            disabled={isLoading}
            autoFocus={variant === 'floating'}
            />
            <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
        </form>
      </div>
    </div>
  );
};
