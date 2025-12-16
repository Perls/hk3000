import { Ingredient, Preset } from '../types';

export const SWEETGREEN_MENU: Ingredient[] = [
    { id: 'sg-kale', name: 'Shredded Kale', category: 'Bases', calories: 30 },
    { id: 'sg-arugula', name: 'Baby Arugula', category: 'Bases', calories: 20 },
    { id: 'sg-wild-rice', name: 'Wild Rice', category: 'Bases', calories: 180 },

    { id: 'sg-chicken', name: 'Roasted Chicken', category: 'Proteins', calories: 190 },
    { id: 'sg-tofu', name: 'Roasted Tofu', category: 'Proteins', calories: 150 },
    { id: 'sg-steelhead', name: 'Steelhead', category: 'Proteins', calories: 220, premium: true },

    { id: 'sg-sweet-potato', name: 'Sweet Potato', category: 'Toppings', calories: 90 },
    { id: 'sg-spicy-broccoli', name: 'Spicy Broccoli', category: 'Toppings', calories: 80 },
    { id: 'sg-tomatoes', name: 'Tomatoes', category: 'Toppings', calories: 20 },
    { id: 'sg-goat-cheese', name: 'Goat Cheese', category: 'Toppings', calories: 80 },
    { id: 'sg-almonds', name: 'Toasted Almonds', category: 'Toppings', calories: 100 },

    { id: 'sg-pesto', name: 'Pesto Vinaigrette', category: 'Dressings', calories: 140 },
    { id: 'sg-tahini', name: 'Lime Cilantro Jalapeño', category: 'Dressings', calories: 100 },
];

export const SWEETGREEN_PRESETS: Preset[] = [
    {
        name: "Harvest Bowl",
        description: "Roasted chicken, sweet potato, almonds, goat cheese, wild rice, kale, balsamic vinaigrette (sub pesto).",
        calories: 685,
        itemIds: ['sg-chicken', 'sg-sweet-potato', 'sg-almonds', 'sg-goat-cheese', 'sg-wild-rice', 'sg-kale', 'sg-pesto']
    }
];
