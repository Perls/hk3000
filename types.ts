
export interface Ingredient {
  id: string;
  name: string;
  category: string; // Changed from enum to string for multi-restaurant flexibility
  image?: string; // Optional URL for item image
  calories?: number;
  premium?: boolean;
  description?: string;
  price?: number;
}

export interface Preset {
  name: string;
  itemIds: string[];
  calories?: number;
  description?: string;
  price?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string; // Emoji or URL
  color: string; // Theme color class
  url?: string; // External ordering URL
  menu: Ingredient[];
  presets?: Preset[];
  address?: string;
  distanceFromRec?: string;
  phoneNumber?: string;
  rating?: number;
  deliveryApps?: string[]; // e.g. ["DoorDash", "GrubHub", "UberEats"]
}

export interface SavedMenu {
  id: string;
  restaurantId: string;
  timestamp: number;
  menu: Ingredient[];
  presets: Preset[];
  sourceUrl?: string;
  label?: string; // Optional user friendly label
}

export interface Order {
  id: string;
  restaurantId: string;
  name: string; // "My Lunch", "Sarah's Order"
  creator: string; // "Me", "Guest"
  items: string[]; // List of Ingredient IDs
  customItems?: string[]; // Manual user entries
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Gemini Response Schema
export interface AIOrderSuggestion {
  orderName: string;
  itemIds: string[];
  reasoning: string;
}

