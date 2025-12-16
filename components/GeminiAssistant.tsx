import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { parseNaturalLanguageOrder } from '../services/geminiService';
import { AIOrderSuggestion, Ingredient } from '../types';

interface GeminiAssistantProps {
  onApplySuggestion: (suggestion: AIOrderSuggestion) => void;
  menu: Ingredient[];
  restaurantName: string;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ onApplySuggestion, menu, restaurantName }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const suggestion = await parseNaturalLanguageOrder(input, menu, restaurantName);
      if (suggestion) {
        onApplySuggestion(suggestion);
        setInput('');
      } else {
        setError("I couldn't quite understand that. Try being more specific about flavors (e.g., 'spicy chicken').");
      }
    } catch (err) {
      setError("Something went wrong with the AI service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-indigo-900">AI Chef Assistant</h3>
      </div>
      
      <p className="text-sm text-indigo-700 mb-3 leading-relaxed">
        Describe what you're craving (e.g., "Post-workout high protein bowl without onions") and I'll build it for you.
      </p>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I want something spicy..."
          className="w-full pl-4 pr-12 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">
          {error}
        </p>
      )}
    </div>
  );
};