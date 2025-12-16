import { Ingredient, Preset } from '../types';

export const CHIPOTLE_MENU: Ingredient[] = [
    { id: 'chip-burrito', name: 'Burrito', category: 'Style', calories: 300 },
    { id: 'chip-bowl', name: 'Bowl', category: 'Style', calories: 0 },
    { id: 'chip-tacos', name: 'Tacos', category: 'Style', calories: 450 },
    { id: 'chip-salad', name: 'Salad', category: 'Style', calories: 0 },
    
    { id: 'chip-chicken', name: 'Chicken', category: 'Protein', calories: 180 },
    { id: 'chip-steak', name: 'Steak', category: 'Protein', calories: 150, premium: true },
    { id: 'chip-barbacoa', name: 'Barbacoa', category: 'Protein', calories: 170, premium: true },
    { id: 'chip-carnitas', name: 'Carnitas', category: 'Protein', calories: 210 },
    { id: 'chip-sofritas', name: 'Sofritas', category: 'Protein', calories: 150 },
    
    { id: 'chip-white-rice', name: 'White Rice', category: 'Rice & Beans', calories: 210 },
    { id: 'chip-brown-rice', name: 'Brown Rice', category: 'Rice & Beans', calories: 210 },
    { id: 'chip-black-beans', name: 'Black Beans', category: 'Rice & Beans', calories: 130 },
    { id: 'chip-pinto-beans', name: 'Pinto Beans', category: 'Rice & Beans', calories: 130 },

    { id: 'chip-mild', name: 'Fresh Tomato Salsa', category: 'Toppings', calories: 25 },
    { id: 'chip-medium', name: 'Roasted Chili-Corn Salsa', category: 'Toppings', calories: 80 },
    { id: 'chip-hot', name: 'Tomatillo-Red Chili Salsa', category: 'Toppings', calories: 30 },
    { id: 'chip-sour-cream', name: 'Sour Cream', category: 'Toppings', calories: 110 },
    { id: 'chip-cheese', name: 'Cheese', category: 'Toppings', calories: 110 },
    { id: 'chip-guac', name: 'Guacamole', category: 'Toppings', calories: 230, premium: true },
    { id: 'chip-lettuce', name: 'Romaine Lettuce', category: 'Toppings', calories: 5 },
];

export const CHIPOTLE_PRESETS: Preset[] = [
    {
        name: "Chicken Burrito Bowl",
        description: "The classic. Chicken, White Rice, Black Beans, Fresh Tomato Salsa, Sour Cream, Cheese, Lettuce.",
        calories: 785,
        itemIds: ['chip-bowl', 'chip-chicken', 'chip-white-rice', 'chip-black-beans', 'chip-mild', 'chip-sour-cream', 'chip-cheese', 'chip-lettuce']
    }
];
