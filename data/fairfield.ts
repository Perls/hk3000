
import { Restaurant } from '../types';

// Random generators for mock data
const getRandomRating = () => (3.8 + Math.random() * 1.2).toFixed(1);
const getRandomApps = () => {
    const apps = ['DoorDash', 'UberEats', 'Grubhub'];
    return apps.filter(() => Math.random() > 0.4);
};

// Helper to generate simple placeholders
const createPlace = (id: string, name: string, emoji: string, type: string, dist: string): Restaurant => ({
    id,
    name,
    logo: emoji,
    color: 'bg-stone-600', // Default neutral color
    url: `https://www.google.com/search?q=${name.replace(/\s/g, '+')}+Fairfield+NJ+Menu`,
    menu: [], // Empty initially, signals dynamic loading
    presets: [],
    address: 'Fairfield, NJ Area',
    distanceFromRec: dist,
    phoneNumber: '(973) 555-' + Math.floor(1000 + Math.random() * 9000),
    rating: parseFloat(getRandomRating()),
    deliveryApps: getRandomApps()
});

export const FAIRFIELD_RESTAURANTS: Restaurant[] = [
    // New Favorites (Closest)
    createPlace('ff-manhattan', 'Manhattan Bagel', '🥯', 'Bagels', '0.3 mi'),
    createPlace('ff-johnny', "Jersey Johnny's Grill", '🌭', 'Grill', '0.5 mi'),
    createPlace('ff-popeyes', 'Popeyes', '🍗', 'Chicken', '0.6 mi'),

    createPlace('ff-doubles', 'Double S Diner', '🍳', 'Diner', '1.1 mi'),
    createPlace('ff-nolas', "Nola's Osteria", '🍝', 'Italian', '2.2 mi'),
    createPlace('ff-cucina', 'Cucina Calandra', '🍷', 'Italian', '1.9 mi'),
    createPlace('ff-nikko', 'Nikko Hibachi', '🍣', 'Japanese', '3.0 mi'),
    createPlace('ff-2920', '2920 Grille', '🥩', 'American', '0.5 mi'),
    createPlace('ff-bellanapoli', 'Bella Napoli', '🍕', 'Pizza', '2.5 mi'),
    createPlace('ff-tasteasia', 'Taste of Asia', '🥡', 'Asian Fusion', '1.7 mi'),
    createPlace('ff-beyondpita', 'Beyond Pita', '🥙', 'Mediterranean', '2.3 mi'),
    createPlace('ff-thatcher', "Thatcher McGhee's", '🍺', 'Pub', '1.0 mi'),
    createPlace('ff-cricket', 'Cricket Hill Brewery', '🍻', 'Brewery', '1.2 mi'),
    createPlace('ff-cheesecake', 'The Cheesecake Factory', '🍰', 'American', '3.5 mi'),
    createPlace('ff-cooper', "Cooper's Hawk", '🍇', 'Winery/American', '3.5 mi'),
    createPlace('ff-seasons', 'Seasons 52', '🥗', 'Grill', '3.6 mi'),
    createPlace('ff-pfchang', "P.F. Chang's", '🥢', 'Chinese', '3.4 mi'),
    createPlace('ff-ruthchris', "Ruth's Chris Steak House", '🥩', 'Steak', '2.8 mi'),
    createPlace('ff-redrobin', 'Red Robin', '🍔', 'Burgers', '4.0 mi'),
    createPlace('ff-chilis', "Chili's Grill & Bar", '🌶️', 'Tex-Mex', '4.1 mi'),
    createPlace('ff-applebees', "Applebee's", '🍎', 'American', '2.9 mi'),
    createPlace('ff-dunkin', 'Dunkin', '🍩', 'Coffee', '0.6 mi'),
    createPlace('ff-starbucks', 'Starbucks', '☕', 'Coffee', '1.5 mi'),
    createPlace('ff-wendys', "Wendy's", '🍟', 'Fast Food', '1.3 mi'),
    createPlace('ff-mcd', "McDonald's", '🍔', 'Fast Food', '1.4 mi'),
    createPlace('ff-bk', 'Burger King', '👑', 'Fast Food', '1.8 mi'),
    createPlace('ff-tacobell', 'Taco Bell', '🌮', 'Fast Food', '2.1 mi'),
    createPlace('ff-subway', 'Subway', '🥪', 'Sandwiches', '1.1 mi'),
    createPlace('ff-panera', 'Panera Bread', '🥖', 'Bakery', '3.2 mi'),
    createPlace('ff-fiveguys', 'Five Guys', '🥜', 'Burgers', '2.7 mi'),
    createPlace('ff-smashburger', 'Smashburger', '🍔', 'Burgers', '3.3 mi'),
    createPlace('ff-habit', 'The Habit Burger Grill', '🍔', 'Burgers', '3.3 mi'),
    createPlace('ff-qdobas', 'QDOBA', '🌯', 'Mexican', '3.1 mi'),
    createPlace('ff-moes', "Moe's Southwest Grill", '🌯', 'Mexican', '2.9 mi'),
    createPlace('ff-tropical', 'Tropical Smoothie Cafe', '🥤', 'Smoothies', '1.6 mi'),
    createPlace('ff-playabowls', 'Playa Bowls', '🍓', 'Acai', '2.4 mi'),
    createPlace('ff-frutta', 'Frutta Bowls', '🥣', 'Acai', '1.8 mi'),
    createPlace('ff-turning', 'Turning Point', '🥞', 'Breakfast', '2.5 mi'),
    createPlace('ff-firstwatch', 'First Watch', '🍳', 'Breakfast', '2.2 mi'),
    createPlace('ff-ihop', 'IHOP', '🥞', 'Breakfast', '4.5 mi'),
    createPlace('ff-dennys', "Denny's", '🥓', 'Diner', '4.2 mi'),
    createPlace('ff-outback', 'Outback Steakhouse', '🥩', 'Steak', '3.8 mi'),
    createPlace('ff-longhorn', 'LongHorn Steakhouse', '🐂', 'Steak', '3.9 mi'),
    createPlace('ff-texas', 'Texas Roadhouse', '🤠', 'Steak', '4.3 mi'),
    createPlace('ff-olive', 'Olive Garden', '🍝', 'Italian', '3.7 mi'),
    createPlace('ff-carrabbas', "Carrabba's Italian Grill", '🍷', 'Italian', '3.6 mi'),
    createPlace('ff-bonefish', 'Bonefish Grill', '🐟', 'Seafood', '3.5 mi'),
    createPlace('ff-legal', 'Legal Sea Foods', '🦞', 'Seafood', '5.0 mi'),
    createPlace('ff-capital', 'The Capital Grille', '🥂', 'Fine Dining', '5.1 mi'),
    createPlace('ff-mortons', "Morton's The Steakhouse", '🥩', 'Steak', '5.2 mi'),
    createPlace('ff-flemings', "Fleming's Steakhouse", '🍷', 'Steak', '5.3 mi'),
    createPlace('ff-maggianos', "Maggiano's Little Italy", '🍝', 'Italian', '5.5 mi'),
    createPlace('ff-yardhouse', 'Yard House', '🍺', 'Pub', '3.5 mi')
];
