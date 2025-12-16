import React from 'react';
import { BowlBuilder } from '../BowlBuilder';
import { RESTAURANTS } from '../../constants';
import { Preset } from '../../types';

interface CavaProps {
    selectedIds: string[];
    customItems: string[];
    onToggleItem: (id: string) => void;
    onSelectPreset: (preset: Preset) => void;
    onAddCustomItem: (item: string) => void;
    onRemoveCustomItem: (index: number) => void;
    categoryFilter: string | 'ALL';
    setCategoryFilter: (cat: string | 'ALL') => void;
    restaurantName?: string;
}

export const Cava: React.FC<CavaProps> = (props) => {
    const restaurant = RESTAURANTS.find(r => r.id === 'cava');
    if (!restaurant) return <div>Data Error</div>;

    return (
        <BowlBuilder 
            menu={restaurant.menu}
            presets={restaurant.presets}
            restaurantColor={restaurant.color}
            {...props}
        />
    );
};
