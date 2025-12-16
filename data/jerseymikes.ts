import { Ingredient, Preset } from '../types';

export const JM_MENU: Ingredient[] = [
    { id: 'jm-bread-white', name: 'White Bread', category: 'Bread', calories: 280 },
    { id: 'jm-bread-wheat', name: 'Wheat Bread', category: 'Bread', calories: 280 },
    { id: 'jm-bread-rosemary', name: 'Rosemary Parm', category: 'Bread', calories: 300 },
    { id: 'jm-bread-tub', name: 'In a Tub (No Bread)', category: 'Bread', calories: 0 },
    
    { id: 'jm-size-mini', name: 'Mini Size', category: 'Size', calories: 0 },
    { id: 'jm-size-reg', name: 'Regular Size', category: 'Size', calories: 0 },
    { id: 'jm-size-giant', name: 'Giant Size', category: 'Size', calories: 0 },

    { id: 'jm-meat-turkey', name: 'Turkey', category: 'Meat', calories: 100 },
    { id: 'jm-meat-ham', name: 'Ham', category: 'Meat', calories: 110 },
    { id: 'jm-meat-roastbeef', name: 'Roast Beef', category: 'Meat', calories: 120 },
    { id: 'jm-meat-tuna', name: 'Tuna', category: 'Meat', calories: 150 },
    { id: 'jm-meat-steak', name: 'Cheesesteak Meat', category: 'Meat', calories: 200 },
    { id: 'jm-meat-chicken', name: 'Chicken Philly', category: 'Meat', calories: 180 },

    { id: 'jm-ch-prov', name: 'Provolone', category: 'Cheese', calories: 80 },
    { id: 'jm-ch-swiss', name: 'Swiss', category: 'Cheese', calories: 80 },
    { id: 'jm-ch-amer', name: 'American', category: 'Cheese', calories: 70 },

    { id: 'jm-mw-onions', name: 'Onions', category: 'Mikes Way', calories: 10 },
    { id: 'jm-mw-lettuce', name: 'Lettuce', category: 'Mikes Way', calories: 5 },
    { id: 'jm-mw-tomato', name: 'Tomatoes', category: 'Mikes Way', calories: 10 },
    { id: 'jm-mw-vinegar', name: 'Red Wine Vinegar', category: 'Mikes Way', calories: 5 },
    { id: 'jm-mw-oil', name: 'Olive Oil Blend', category: 'Mikes Way', calories: 150 },
    { id: 'jm-mw-spices', name: 'Oregano & Salt', category: 'Mikes Way', calories: 0 },
    
    { id: 'jm-top-mayo', name: 'Mayo', category: 'Toppings', calories: 100 },
    { id: 'jm-top-bacon', name: 'Bacon', category: 'Toppings', calories: 80 },
    { id: 'jm-top-peppers', name: 'Cherry Pepper Relish', category: 'Toppings', calories: 15 },
];

export const JM_PRESETS: Preset[] = [
    {
        name: "#7 Turkey and Provolone",
        description: "One of our most popular! Turkey and provolone, best served Mike's Way.",
        calories: 530,
        price: 9.95,
        itemIds: ['jm-bread-white', 'jm-size-reg', 'jm-meat-turkey', 'jm-ch-prov', 'jm-mw-onions', 'jm-mw-lettuce', 'jm-mw-tomato', 'jm-mw-vinegar', 'jm-mw-oil', 'jm-mw-spices']
    },
    {
        name: "#13 The Original Italian",
        description: "Provolone, ham, prosciuttini, cappacuolo, salami and pepperoni.",
        calories: 680,
        price: 10.95,
        itemIds: ['jm-bread-white', 'jm-size-reg', 'jm-ch-prov', 'jm-meat-ham', 'jm-mw-onions', 'jm-mw-lettuce', 'jm-mw-tomato', 'jm-mw-vinegar', 'jm-mw-oil', 'jm-mw-spices']
    },
    {
        name: "#17 Mike's Famous Philly",
        description: "Grilled onions, peppers & white American cheese.",
        calories: 710,
        price: 10.95,
        itemIds: ['jm-bread-white', 'jm-size-reg', 'jm-meat-steak', 'jm-ch-amer', 'jm-mw-onions']
    }
];
