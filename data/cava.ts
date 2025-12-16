import { Ingredient, Preset } from '../types';

export const CAVA_MENU: Ingredient[] = [
  // Bases
  { id: 'cava-base-saffron', name: 'Saffron Basmati Rice', category: 'Grains', calories: 190 },
  { id: 'cava-base-brown', name: 'Brown Basmati Rice', category: 'Grains', calories: 180 },
  { id: 'cava-base-lentils', name: 'Black Lentils', category: 'Grains', calories: 130 },
  { id: 'cava-base-rightrice', name: 'RightRice®', category: 'Grains', calories: 180, description: 'High protein veggie rice' },
  { id: 'cava-base-greens', name: 'SuperGreens Mix', category: 'Greens', calories: 30, description: 'Brussels sprouts, broccoli, radicchio, kale, chicory' },
  { id: 'cava-base-arugula', name: 'Arugula', category: 'Greens', calories: 15 },
  { id: 'cava-base-spinach', name: 'Baby Spinach', category: 'Greens', calories: 15 },
  { id: 'cava-base-romaine', name: 'Romaine', category: 'Greens', calories: 15 },
  { id: 'cava-base-splendid', name: 'SplendidGreens®', category: 'Greens', calories: 30 },
  { id: 'cava-base-pita', name: 'Pita', category: 'Base', calories: 200, description: 'Fluffy and perfectly chewy pita' },

  // Proteins
  { id: 'cava-prot-chicken', name: 'Grilled Chicken', category: 'Protein', calories: 230 },
  { id: 'cava-prot-honey-chicken', name: 'Harissa Honey Chicken', category: 'Protein', calories: 240 },
  { id: 'cava-prot-shawarma', name: 'Chicken Shawarma', category: 'Protein', calories: 210 },
  { id: 'cava-prot-steak', name: 'Grilled Steak', category: 'Protein', calories: 260, premium: true },
  { id: 'cava-prot-meatballs', name: 'Spicy Lamb Meatballs', category: 'Protein', calories: 290 },
  { id: 'cava-prot-lamb', name: 'Braised Lamb', category: 'Protein', calories: 280, premium: true },
  { id: 'cava-prot-falafel', name: 'Falafel', category: 'Protein', calories: 240 },
  { id: 'cava-prot-veg', name: 'Roasted Vegetables', category: 'Protein', calories: 110 },

  // Dips
  { id: 'cava-dip-tzatziki', name: 'Tzatziki', category: 'Dips', calories: 30 },
  { id: 'cava-dip-hummus', name: 'Hummus', category: 'Dips', calories: 45 },
  { id: 'cava-dip-red-pepper', name: 'Red Pepper Hummus', category: 'Dips', calories: 40 },
  { id: 'cava-dip-eggplant', name: 'Roasted Eggplant', category: 'Dips', calories: 35 },
  { id: 'cava-dip-crazy-feta', name: 'Crazy Feta®', category: 'Dips', calories: 110, description: 'Jalapeño-infused feta mousse' },
  { id: 'cava-dip-harissa', name: 'Harissa', category: 'Dips', calories: 60, description: 'Traditional spicy red pepper paste' },

  // Toppings
  { id: 'cava-top-onion', name: 'Pickled Onions', category: 'Toppings', calories: 15 },
  { id: 'cava-top-tomato', name: 'Tomato + Cucumber', category: 'Toppings', calories: 15 },
  { id: 'cava-top-cabbage', name: 'Cabbage Slaw', category: 'Toppings', calories: 25 },
  { id: 'cava-top-pickles', name: 'Salt-Brined Pickles', category: 'Toppings', calories: 5 },
  { id: 'cava-top-olives', name: 'Kalamata Olives', category: 'Toppings', calories: 45 },
  { id: 'cava-top-corn', name: 'Fire Roasted Corn', category: 'Toppings', calories: 60 },
  { id: 'cava-top-broccoli', name: 'Fiery Broccoli', category: 'Toppings', calories: 45 },
  { id: 'cava-top-feta', name: 'Crumbled Feta', category: 'Toppings', calories: 90 },
  { id: 'cava-top-avocado', name: 'Avocado', category: 'Toppings', calories: 80, premium: true },
  { id: 'cava-top-crisps', name: 'Pita Crisps', category: 'Toppings', calories: 130 },

  // Dressings
  { id: 'cava-dress-greek', name: 'Greek Vinaigrette', category: 'Dressing', calories: 140 },
  { id: 'cava-dress-yogurt', name: 'Yogurt Dill', category: 'Dressing', calories: 45 },
  { id: 'cava-dress-skhug', name: 'Skhug', category: 'Dressing', calories: 110 },
  { id: 'cava-dress-garlic', name: 'Garlic Dressing', category: 'Dressing', calories: 140 },
  { id: 'cava-dress-balsamic', name: 'Balsamic Date', category: 'Dressing', calories: 100 },
  { id: 'cava-dress-harissa', name: 'Hot Harissa Vinaigrette', category: 'Dressing', calories: 90 },
  { id: 'cava-dress-tahini', name: 'Lemon Herb Tahini', category: 'Dressing', calories: 90 },
];

export const CAVA_PRESETS: Preset[] = [
  {
    name: "Chicken + Rice",
    description: "Grilled chicken, brown rice, tzatziki, hummus, feta, pickled onion, tomato, arugula, Greek vinaigrette.",
    calories: 710,
    price: 14.45,
    itemIds: ['cava-prot-chicken', 'cava-base-brown', 'cava-dip-tzatziki', 'cava-dip-hummus', 'cava-top-feta', 'cava-top-onion', 'cava-top-tomato', 'cava-base-arugula', 'cava-dress-greek']
  },
  {
    name: "Falafel Crunch",
    description: "Falafel, roasted veggies, hummus, Crazy Feta®, pickled onions, pita crisps, lentils, rice, greens, skhug.",
    calories: 860,
    price: 14.45,
    itemIds: ['cava-prot-falafel', 'cava-prot-veg', 'cava-dip-hummus', 'cava-dip-crazy-feta', 'cava-top-onion', 'cava-top-crisps', 'cava-base-lentils', 'cava-base-saffron', 'cava-base-supergreens', 'cava-dress-skhug']
  },
  {
    name: "Greek Salad",
    description: "Grilled chicken, tzatziki, hummus, feta, cucumber, tomato + onion, Kalamata olives, romaine, arugula, Greek vinaigrette.",
    calories: 585,
    price: 14.45,
    itemIds: ['cava-prot-chicken', 'cava-dip-tzatziki', 'cava-dip-hummus', 'cava-top-feta', 'cava-top-tomato', 'cava-top-olives', 'cava-base-romaine', 'cava-base-arugula', 'cava-dress-greek']
  },
  {
    name: "Garlicky Chicken Shawarma",
    description: "Chicken shawarma, red pepper hummus, Crazy Feta®, corn, onions, broccoli, rice, skhug, garlic dressing.",
    calories: 600,
    price: 16.97,
    itemIds: ['cava-prot-shawarma', 'cava-dip-red-pepper', 'cava-dip-crazy-feta', 'cava-top-corn', 'cava-top-onion', 'cava-top-broccoli', 'cava-base-saffron', 'cava-dress-skhug', 'cava-dress-garlic']
  },
  {
    name: "Steak + Harissa",
    description: "Steak, Crazy Feta®, red pepper hummus, tomato + onion, cucumber, feta, slaw, brown rice, greens, harissa vinaigrette.",
    calories: 615,
    price: 18.76,
    itemIds: ['cava-prot-steak', 'cava-dip-crazy-feta', 'cava-dip-red-pepper', 'cava-top-tomato', 'cava-top-feta', 'cava-top-cabbage', 'cava-base-brown', 'cava-base-supergreens', 'cava-dress-harissa']
  },
  {
    name: "Harissa Avocado",
    description: "Harissa honey chicken, Crazy Feta®, hummus, corn, avocado, rice, SuperGreens, harissa vinaigrette.",
    calories: 840,
    price: 19.74,
    itemIds: ['cava-prot-honey-chicken', 'cava-dip-crazy-feta', 'cava-dip-hummus', 'cava-top-corn', 'cava-top-avocado', 'cava-base-saffron', 'cava-base-supergreens', 'cava-dress-harissa']
  },
  {
    name: "Spicy Lamb + Avocado",
    description: "Spicy lamb meatballs, avocado, Crazy Feta®, red pepper hummus, pickled onions, lentils, lemon herb tahini.",
    calories: 795,
    price: 20.85,
    itemIds: ['cava-prot-meatballs', 'cava-top-avocado', 'cava-dip-crazy-feta', 'cava-dip-red-pepper', 'cava-top-onion', 'cava-base-lentils', 'cava-dress-tahini']
  }
];
