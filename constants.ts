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
        presets: CAVA_PRESETS
    },
    {
        id: 'chipotle',
        name: 'Chipotle',
        logo: '🌯',
        color: 'bg-red-800',
        url: 'https://www.chipotle.com/order',
        menu: CHIPOTLE_MENU,
        presets: CHIPOTLE_PRESETS
    },
    {
        id: 'sweetgreen',
        name: 'Sweetgreen',
        logo: '🥗',
        color: 'bg-green-700',
        url: 'https://order.sweetgreen.com/',
        menu: SWEETGREEN_MENU,
        presets: SWEETGREEN_PRESETS
    },
    {
        id: 'jerseymikes',
        name: "Jersey Mike's",
        logo: '🥪',
        color: 'bg-blue-700',
        url: 'https://www.jerseymikes.com/order',
        menu: JM_MENU,
        presets: JM_PRESETS
    },
    {
        id: 'josetejas',
        name: 'Jose Tejas',
        logo: '🌮',
        color: 'bg-yellow-600',
        url: 'http://www.bordercafe.com/',
        menu: JT_MENU,
        presets: JT_PRESETS
    },
    {
        id: 'shakeshack',
        name: 'Shake Shack',
        logo: '🍔',
        color: 'bg-green-500',
        url: 'https://shakeshack.com/order',
        menu: SS_MENU,
        presets: SS_PRESETS
    },
    {
        id: 'franklin',
        name: 'Franklin Steakhouse',
        logo: '🥩',
        color: 'bg-stone-800',
        url: 'https://franklinsteakhousefairfield.com/',
        menu: FRANKLIN_MENU,
        presets: FRANKLIN_PRESETS
    },
    {
        id: 'calandras',
        name: "Calandra's Grill",
        logo: '🍝',
        color: 'bg-red-700',
        url: 'https://calandrasmedgrill.com/',
        menu: CALANDRAS_MENU,
        presets: CALANDRAS_PRESETS
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
