import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Ingredient, Preset } from '../types';
import { AIOrderSuggestion } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ORDER_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    orderName: {
      type: Type.STRING,
      description: "A creative name for this custom order",
    },
    itemIds: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of exact ID strings from the provided menu list",
    },
    reasoning: {
      type: Type.STRING,
      description: "A short, fun explanation of why these ingredients work well together",
    },
  },
  required: ["orderName", "itemIds", "reasoning"],
};

const MENU_GENERATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    menu: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          calories: { type: Type.NUMBER, nullable: true },
          price: { type: Type.NUMBER, nullable: true },
          description: { type: Type.STRING, nullable: true },
          premium: { type: Type.BOOLEAN, nullable: true }
        },
        required: ["id", "name", "category"]
      }
    },
    presets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          calories: { type: Type.NUMBER, nullable: true },
          price: { type: Type.NUMBER, nullable: true },
          itemIds: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "itemIds"]
      }
    }
  },
  required: ["menu", "presets"]
};

const MODS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 short, likely customization options (e.g. 'No Onions', 'Sauce on Side', 'Medium Rare')",
    }
  },
  required: ["options"]
};

export const parseNaturalLanguageOrder = async (
  userPrompt: string,
  menu: Ingredient[],
  restaurantName: string
): Promise<AIOrderSuggestion | null> => {
  try {
    const menuContext = menu.map(item => `${item.name} (ID: ${item.id}, Cat: ${item.category})`).join(', ');
    
    const systemInstruction = `
      You are an expert ${restaurantName} ordering assistant. 
      Your goal is to interpret a user's natural language desire and map it to a valid list of ingredient IDs from the provided menu.
      
      Available Menu Items for ${restaurantName}:
      ${menuContext}
      
      Rules:
      1. ONLY use IDs provided in the menu context.
      2. If the user mentions vague terms like "healthy", "spicy", or "classic", interpret them based on the specific ingredients available.
      3. Construct a logical order (e.g., Base + Protein + Toppings).
      4. Ignore ingredients not in the list.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ORDER_SCHEMA,
        temperature: 0.3, 
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIOrderSuggestion;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateMenuFromContext = async (
  restaurantName: string,
  context: string
): Promise<{ menu: Ingredient[], presets: Preset[] } | null> => {
  try {
    const systemInstruction = `
      You are a menu digitization expert. 
      Generate a realistic, structured menu for a restaurant named "${restaurantName}".
      
      Context provided by user (URL or text): "${context}"
      
      If the context is a URL, assume you visited it and extracted the likely menu items based on the restaurant's name and typical cuisine.
      If the context is text, parse it into ingredients/options.
      
      Create 20-40 distinct menu items (Ingredients) categorized logically (e.g., Appetizers, Entrees, Sides, Drinks, or Bases, Proteins, Toppings if it's a bowl place).
      Create 2-4 Presets (signature meals).
      
      Ensure IDs are unique and URL-friendly (e.g., "res-burger").
      Estimate calories and prices if not explicit.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate menu for ${restaurantName}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: MENU_GENERATION_SCHEMA,
        temperature: 0.4,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Menu Gen Error:", error);
    return null;
  }
};

export const generateItemModifications = async (
  itemName: string,
  restaurantName: string
): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest 4 common customization options/modifiers for "${itemName}" at a place like "${restaurantName}". Keep them short. Examples: 'No Ice', 'Extra Sauce', 'Well Done'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: MODS_SCHEMA,
        temperature: 0.4,
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.options || [];
    }
    return [];
  } catch (error) {
    console.error("Gemini Mod Gen Error:", error);
    return [];
  }
};
