import { Ingredient, Preset } from '../types';

export const SS_MENU: Ingredient[] = [
    { id: 'ss-main-shack', name: 'ShackBurger', category: 'Burgers', calories: 500 },
    { id: 'ss-main-smoke', name: 'SmokeShack', category: 'Burgers', calories: 570 },
    { id: 'ss-main-shroom', name: 'Shroom Burger', category: 'Burgers', calories: 510, description: 'Vegetarian' },
    { id: 'ss-main-chick', name: 'Chicken Shack', category: 'Chicken', calories: 550 },
    
    { id: 'ss-side-fries', name: 'Crinkle Cut Fries', category: 'Sides', calories: 420 },
    { id: 'ss-side-chfries', name: 'Cheese Fries', category: 'Sides', calories: 560 },
    { id: 'ss-side-baconfries', name: 'Bacon Cheese Fries', category: 'Sides', calories: 680 },

    { id: 'ss-drink-van', name: 'Vanilla Shake', category: 'Shakes', calories: 650 },
    { id: 'ss-drink-choc', name: 'Chocolate Shake', category: 'Shakes', calories: 680 },
    { id: 'ss-drink-straw', name: 'Strawberry Shake', category: 'Shakes', calories: 660 },
    { id: 'ss-drink-lemon', name: 'Lemonade', category: 'Drinks', calories: 200 },
];

export const SS_PRESETS: Preset[] = [
    {
        name: "Shack Classic",
        description: "ShackBurger with Cheese Fries and a Vanilla Shake.",
        calories: 1710,
        price: 18.50,
        itemIds: ['ss-main-shack', 'ss-side-chfries', 'ss-drink-van']
    }
];
