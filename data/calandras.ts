import { Ingredient, Preset } from '../types';

export const CALANDRAS_MENU: Ingredient[] = [
    { id: 'cal-app-antipasto', name: 'Antipasto Freddo', category: 'Appetizers', calories: 600 },
    { id: 'cal-app-calamari', name: 'Fried Calamari', category: 'Appetizers', calories: 750 },
    { id: 'cal-app-meatballs', name: 'Nonna’s Meatballs', category: 'Appetizers', calories: 500 },

    { id: 'cal-main-penne', name: 'Penne Vodka', category: 'Pasta', calories: 950 },
    { id: 'cal-main-lasagna', name: 'Lasagna', category: 'Pasta', calories: 1100 },
    { id: 'cal-main-linguine', name: 'Linguine with Clams', category: 'Pasta', calories: 850 },
    
    { id: 'cal-main-parm', name: 'Chicken Parmigiana', category: 'Entrees', calories: 1200 },
    { id: 'cal-main-francese', name: 'Chicken Francese', category: 'Entrees', calories: 1000 },
    { id: 'cal-main-salmon', name: 'Grilled Salmon', category: 'Entrees', calories: 700 },

    { id: 'cal-pizza-margherita', name: 'Margherita Pizza', category: 'Pizza', calories: 1200 },
    { id: 'cal-pizza-arugula', name: 'Arugula & Prosciutto Pizza', category: 'Pizza', calories: 1300 },
];

export const CALANDRAS_PRESETS: Preset[] = [
    {
        name: "Sunday Dinner",
        description: "Nonna's Meatballs followed by Chicken Parmigiana.",
        calories: 1700,
        price: 32.00,
        itemIds: ['cal-app-meatballs', 'cal-main-parm']
    },
    {
        name: "Pizza Night",
        description: "Margherita Pizza with a side of Calamari.",
        calories: 1950,
        price: 28.00,
        itemIds: ['cal-pizza-margherita', 'cal-app-calamari']
    }
];
