
import { Restaurant } from './types';
import { CAVA_MENU, CAVA_PRESETS } from './data/cava';
import { CHIPOTLE_MENU, CHIPOTLE_PRESETS } from './data/chipotle';
import { SWEETGREEN_MENU, SWEETGREEN_PRESETS } from './data/sweetgreen';
import { JM_MENU, JM_PRESETS } from './data/jerseymikes';
import { JT_MENU, JT_PRESETS } from './data/josetejas';
import { SS_MENU, SS_PRESETS } from './data/shakeshack';
import { FRANKLIN_MENU, FRANKLIN_PRESETS } from './data/franklin';
import { CALANDRAS_MENU, CALANDRAS_PRESETS } from './data/calandras';

export const RESTAURANTS: Restaurant[] = [
    {
        id: 'cava',
        name: 'Cava',
        logo: '🥙',
        color: 'bg-orange-600',
        url: 'https://order.cava.com/',
        menu: CAVA_MENU,
        presets: CAVA_PRESETS,
        address: '400 US-46, Wayne, NJ 07470',
        distanceFromRec: '2.1 mi',
        phoneNumber: '(973) 785-0010',
        rating: 4.7,
        deliveryApps: ['DoorDash', 'UberEats']
    },
    {
        id: 'chipotle',
        name: 'Chipotle',
        logo: '🌯',
        color: 'bg-red-800',
        url: 'https://www.chipotle.com/order',
        menu: CHIPOTLE_MENU,
        presets: CHIPOTLE_PRESETS,
        address: '387 US-46, Fairfield, NJ 07004',
        distanceFromRec: '1.8 mi',
        phoneNumber: '(973) 882-9696',
        rating: 4.1,
        deliveryApps: ['DoorDash', 'Grubhub', 'UberEats']
    },
    {
        id: 'sweetgreen',
        name: 'Sweetgreen',
        logo: '🥗',
        color: 'bg-green-700',
        url: 'https://order.sweetgreen.com/',
        menu: SWEETGREEN_MENU,
        presets: SWEETGREEN_PRESETS,
        address: 'Willowbrook Mall, Wayne, NJ 07470',
        distanceFromRec: '3.4 mi',
        phoneNumber: '(862) 294-2660',
        rating: 4.5,
        deliveryApps: ['UberEats', 'DoorDash']
    },
    {
        id: 'jerseymikes',
        name: "Jersey Mike's",
        logo: '🥪',
        color: 'bg-blue-700',
        url: 'https://www.jerseymikes.com/order',
        menu: JM_MENU,
        presets: JM_PRESETS,
        address: '304 US-46, Fairfield, NJ 07004',
        distanceFromRec: '1.5 mi',
        phoneNumber: '(973) 808-5500',
        rating: 4.6,
        deliveryApps: ['DoorDash', 'Grubhub', 'UberEats']
    },
    {
        id: 'josetejas',
        name: 'Jose Tejas',
        logo: '🌮',
        color: 'bg-yellow-600',
        url: 'http://www.bordercafe.com/',
        menu: JT_MENU,
        presets: JT_PRESETS,
        address: '700 US-46, Fairfield, NJ 07004',
        distanceFromRec: '0.8 mi',
        phoneNumber: '(973) 808-8888',
        rating: 4.6,
        deliveryApps: [] // Often doesn't do 3rd party
    },
    {
        id: 'shakeshack',
        name: 'Shake Shack',
        logo: '🍔',
        color: 'bg-green-500',
        url: 'https://shakeshack.com/order',
        menu: SS_MENU,
        presets: SS_PRESETS,
        address: '479 US-46, Wayne, NJ 07470',
        distanceFromRec: '2.5 mi',
        phoneNumber: '(862) 210-9150',
        rating: 4.4,
        deliveryApps: ['Grubhub', 'UberEats']
    },
    {
        id: 'franklin',
        name: 'Franklin Steakhouse',
        logo: '🥩',
        color: 'bg-stone-800',
        url: 'https://franklinsteakhousefairfield.com/',
        menu: FRANKLIN_MENU,
        presets: FRANKLIN_PRESETS,
        address: '318 Passaic Ave, Fairfield, NJ 07004',
        distanceFromRec: '1.2 mi',
        phoneNumber: '(973) 808-9400',
        rating: 4.5,
        deliveryApps: ['DoorDash']
    },
    {
        id: 'calandras',
        name: "Calandra's Grill",
        logo: '🍝',
        color: 'bg-red-700',
        url: 'https://calandrasmedgrill.com/',
        menu: CALANDRAS_MENU,
        presets: CALANDRAS_PRESETS,
        address: '118 US-46, Fairfield, NJ 07004',
        distanceFromRec: '2.0 mi',
        phoneNumber: '(973) 575-6500',
        rating: 4.3,
        deliveryApps: ['DoorDash', 'UberEats']
    }
];

export const ALL_INGREDIENTS = [
    ...CAVA_MENU, 
    ...CHIPOTLE_MENU, 
    ...SWEETGREEN_MENU,
    ...JM_MENU,
    ...JT_MENU,
    ...SS_MENU,
    ...FRANKLIN_MENU,
    ...CALANDRAS_MENU
];
