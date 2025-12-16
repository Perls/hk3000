import { Ingredient, Preset } from '../types';

export const JT_MENU: Ingredient[] = [
    { id: 'jt-app-guac', name: 'Guacamole', category: 'Appetizers', calories: 300 },
    { id: 'jt-app-empanada', name: 'Empanadas', category: 'Appetizers', calories: 400 },
    { id: 'jt-app-chili', name: 'Chili Con Queso', category: 'Appetizers', calories: 350 },

    { id: 'jt-main-bsalad', name: 'Blackened Chicken Salad', category: 'Entrees', calories: 650 },
    { id: 'jt-main-jamba', name: 'Jambalaya', category: 'Entrees', calories: 800 },
    { id: 'jt-main-fajita-chk', name: 'Chicken Fajitas', category: 'Entrees', calories: 900 },
    { id: 'jt-main-fajita-stk', name: 'Steak Fajitas', category: 'Entrees', calories: 1000 },
    { id: 'jt-main-burrito', name: 'Monster Burrito', category: 'Entrees', calories: 1100 },
    { id: 'jt-main-catfish', name: 'Blackened Catfish', category: 'Entrees', calories: 700 },

    { id: 'jt-side-rice', name: 'Mexican Rice', category: 'Sides', calories: 200 },
    { id: 'jt-side-beans', name: 'Black Beans', category: 'Sides', calories: 150 },
    { id: 'jt-side-cornbread', name: 'Cornbread', category: 'Sides', calories: 300 },
    { id: 'jt-side-veggies', name: 'Mixed Veggies', category: 'Sides', calories: 100 },
    
    { id: 'jt-drink-marg', name: 'Margarita (Rocks)', category: 'Drinks', calories: 400 },
];

export const JT_PRESETS: Preset[] = [
    {
        name: "Blackened Chicken Salad",
        description: "The Legend. Mixed greens, spicy blackened chicken, tomatoes, onions, cheddar, house vinaigrette.",
        calories: 650,
        price: 13.95,
        itemIds: ['jt-main-bsalad', 'jt-side-cornbread']
    },
    {
        name: "Chicken Fajitas",
        description: "Sizzling skillet with onions and peppers. Served with rice, beans, tortillas, guac, sour cream.",
        calories: 900,
        price: 16.95,
        itemIds: ['jt-main-fajita-chk', 'jt-side-rice', 'jt-side-beans']
    }
];
