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

// Helper: Stage 1 - Search for raw text content
async function searchForMenuInfo(restaurantName: string, context: string, mode: 'standard' | 'deep'): Promise<string> {
  const isDeep = mode === 'deep';
  const prompt = isDeep 
    ? `Perform a deep search for the complete menu of ${restaurantName} (URL/Context: ${context}). Find appetizers, entrees, sides, desserts, and drinks. Include ingredient details and prices if possible.`
    : `Find the current menu items for ${restaurantName} (URL/Context: ${context}). List main dishes and prices.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }], // Use Search Grounding to actually see the web
      // NOTE: responseSchema is NOT allowed with googleSearch
    }
  });

  return response.text || "";
}

// Helper: Stage 2 - Structure raw text into JSON
async function structureMenuData(restaurantName: string, rawText: string): Promise<{ menu: Ingredient[], presets: Preset[] } | null> {
  const systemInstruction = `
    You are a data structuring engine.
    Take the provided menu text for "${restaurantName}" and convert it into the strict JSON schema provided.
    
    Source Text:
    ${rawText.substring(0, 30000)}

    Rules:
    1. Generate unique, URL-safe IDs (e.g. 'item-burger', 'item-coke').
    2. Group items into 5-10 logical Categories (e.g. "Appetizers", "Main Course", "Sides").
    3. If prices are missing in the text, estimate them based on typical restaurant pricing.
    4. Create 3-5 Presets that combine items logically.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Structure this menu data.",
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: MENU_GENERATION_SCHEMA,
      temperature: 0.2,
    }
  });

  if (response.text) {
    return JSON.parse(response.text);
  }
  return null;
}

export const generateMenuFromContext = async (
  restaurantName: string,
  context: string,
  mode: 'standard' | 'deep' = 'standard'
): Promise<{ menu: Ingredient[], presets: Preset[] } | null> => {
  try {
    const isUrl = context.trim().match(/^(http|www\.)/i);
    let rawContext = context;

    // Stage 1: If it's a URL or deep scan, use Google Search tool to get the content
    // We cannot just pass a URL to the JSON model; it can't browse.
    if (isUrl || mode === 'deep') {
      try {
        console.log(`[Gemini] Starting Stage 1: Search (${mode}) for ${restaurantName}`);
        const searchResult = await searchForMenuInfo(restaurantName, context, mode);
        if (searchResult) {
          rawContext = searchResult;
        }
      } catch (e) {
        console.warn("[Gemini] Search stage failed, attempting direct parse", e);
      }
    }

    // Stage 2: Structure the data
    console.log(`[Gemini] Starting Stage 2: Structuring JSON`);
    return await structureMenuData(restaurantName, rawContext);

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
