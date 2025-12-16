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

// Helper: Stage 1 - Search for raw text content using Google Search
async function searchForMenuInfo(restaurantName: string, context: string, mode: 'standard' | 'deep'): Promise<string | null> {
  try {
    const isDeep = mode === 'deep';
    const prompt = isDeep 
      ? `Perform a deep search for the complete menu of ${restaurantName} (URL/Context: ${context}). Find appetizers, entrees, sides, desserts, and drinks. Include ingredient details and prices if possible.`
      : `Find the current menu items for ${restaurantName} (URL/Context: ${context}). List main dishes and prices.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: We are not enforcing JSON here, we want rich text search results
      }
    });

    // If Google Search was used, groundingChunks will be present. 
    // We log them for debugging/audit purposes.
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      console.log("Grounding Chunks:", response.candidates[0].groundingMetadata.groundingChunks);
    }

    return response.text || null;
  } catch (e) {
    console.warn("Search tool failed or not enabled", e);
    return null;
  }
}

// Helper: Stage 1 (Fallback) - Use Internal Knowledge
async function generateInternalMenuKnowledge(restaurantName: string): Promise<string> {
  try {
    const prompt = `
      Generate a comprehensive menu listing for the restaurant "${restaurantName}" based on your internal knowledge.
      Include Categories (Appetizers, Mains, Sides, Drinks).
      List specific item names, descriptions, and estimated prices ($).
      Be as detailed as possible to simulate a real menu.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      // No tools, just pure generation
    });
    
    return response.text || "";
  } catch (e) {
    console.error("Internal knowledge generation failed", e);
    return "";
  }
}

// Helper: Stage 2 - Structure raw text into JSON
async function structureMenuData(restaurantName: string, rawText: string): Promise<{ menu: Ingredient[], presets: Preset[] } | null> {
  try {
    const systemInstruction = `
      You are a data structuring engine.
      Take the provided menu text for "${restaurantName}" and convert it into the strict JSON schema provided.
      
      Source Text:
      ${rawText.substring(0, 50000)}

      Rules:
      1. Generate unique, URL-safe IDs (e.g. 'item-burger', 'item-coke').
      2. Group items into 5-10 logical Categories (e.g. "Appetizers", "Main Course", "Sides").
      3. If prices are missing in the text, ESTIMATE them based on typical restaurant pricing (e.g., Burger $15, Soda $3).
      4. Create 3-5 Presets that combine items logically.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Structure this menu data.",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: MENU_GENERATION_SCHEMA,
        temperature: 0.4, // Slightly creative to fill in gaps (like prices) if missing
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (e) {
    console.error("Structuring failed", e);
    return null;
  }
}

export const generateMenuFromContext = async (
  restaurantName: string,
  context: string,
  mode: 'standard' | 'deep' = 'standard'
): Promise<{ menu: Ingredient[], presets: Preset[] } | null> => {
  try {
    const isUrl = context.trim().match(/^(http|www\.)/i);
    let rawContext = "";

    // 1. Attempt Search
    if (isUrl || mode === 'deep') {
      console.log(`[Gemini] Attempting Search (${mode}) for ${restaurantName}`);
      const searchResult = await searchForMenuInfo(restaurantName, context, mode);
      if (searchResult && searchResult.length > 100) {
        rawContext = searchResult;
      }
    }

    // 2. Fallback to Internal Knowledge if Search failed or returned poor results
    if (!rawContext) {
      console.log(`[Gemini] Search invalid or skipped. Using Internal Knowledge for ${restaurantName}`);
      rawContext = await generateInternalMenuKnowledge(restaurantName);
    }

    // 3. If we still have no text, we can't structure anything.
    if (!rawContext || rawContext.length < 50) {
      throw new Error("Could not gather enough context to generate a menu.");
    }

    // 4. Structure the data
    console.log(`[Gemini] Structuring Menu Data...`);
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