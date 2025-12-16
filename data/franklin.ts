import { Ingredient, Preset } from '../types';

export const FRANKLIN_MENU: Ingredient[] = [
    { id: 'fs-app-wings', name: 'Buffalo Wings', category: 'Appetizers', calories: 800 },
    { id: 'fs-app-soup', name: 'French Onion Soup', category: 'Appetizers', calories: 350 },
    { id: 'fs-app-calamari', name: 'Fried Calamari', category: 'Appetizers', calories: 700 },

    { id: 'fs-main-burger', name: 'Franklin Burger', category: 'Burgers', calories: 900, description: '10oz Angus beef, lettuce, tomato, onion' },
    { id: 'fs-main-bacon-burger', name: 'Bacon Cheddar Burger', category: 'Burgers', calories: 1100 },
    
    { id: 'fs-main-ribeye', name: 'Ribeye Steak (14oz)', category: 'Steaks', calories: 1200, premium: true },
    { id: 'fs-main-nystrip', name: 'NY Strip (12oz)', category: 'Steaks', calories: 1000, premium: true },
    { id: 'fs-main-filet', name: 'Filet Mignon (8oz)', category: 'Steaks', calories: 700, premium: true },

    { id: 'fs-sal-cobb', name: 'Cobb Salad', category: 'Salads', calories: 600 },
    { id: 'fs-sal-caesar', name: 'Caesar Salad', category: 'Salads', calories: 500 },

    { id: 'fs-side-fries', name: 'French Fries', category: 'Sides', calories: 400 },
    { id: 'fs-side-mash', name: 'Mashed Potatoes', category: 'Sides', calories: 350 },
    { id: 'fs-side-spinach', name: 'Creamed Spinach', category: 'Sides', calories: 450 },
];

export const FRANKLIN_PRESETS: Preset[] = [
    {
        name: "Steakhouse Classic",
        description: "NY Strip served with Mashed Potatoes and Creamed Spinach.",
        calories: 1800,
        price: 38.00,
        itemIds: ['fs-main-nystrip', 'fs-side-mash', 'fs-side-spinach']
    },
    {
        name: "Franklin Burger Platter",
        description: "Signature burger with a side of fries.",
        calories: 1300,
        price: 18.00,
        itemIds: ['fs-main-burger', 'fs-side-fries']
    }
];
