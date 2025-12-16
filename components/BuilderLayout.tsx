
import React from 'react';
import { Save, Utensils, X, PenTool } from 'lucide-react';
import { Restaurant, Ingredient, Preset, SavedMenu } from '../types';
import { MenuImporter } from './MenuImporter';
import { BowlBuilder } from './BowlBuilder';
import { GeminiAssistant } from './GeminiAssistant';
import { Cava } from './restaurants/Cava';
import { Chipotle } from './restaurants/Chipotle';
import { Sweetgreen } from './restaurants/Sweetgreen';
import { JerseyMikes } from './restaurants/JerseyMikes';
import { JoseTejas } from './restaurants/JoseTejas';
import { ShakeShack } from './restaurants/ShakeShack';
import { FranklinSteakhouse } from './restaurants/FranklinSteakhouse';
import { Calandras } from './restaurants/Calandras';
import { RestaurantDistance } from './RestaurantDistance';

interface BuilderLayoutProps {
    activeRestaurant: Restaurant;
    selectedIds: string[];
    customItems: string[];
    menu: Ingredient[];
    presets: Preset[];
    savedMenus: Record<string, SavedMenu[]>;
    activeMenuVersionId: string | 'SYSTEM' | 'NEW' | null;
    activeCategory: string | 'ALL';
    setActiveCategory: (c: string | 'ALL') => void;
    setActiveMenuVersionId: (id: string | 'SYSTEM' | 'NEW' | null) => void;
    toggleIngredient: (id: string) => void;
    handleSelectPreset: (p: Preset) => void;
    handleAddCustomItem: (s: string) => void;
    handleRemoveCustomItem: (i: number) => void;
    handleSaveOrder: () => void;
    handleApplyAISuggestion: (s: any) => void;
    calculateTotalCalories: () => number;
    setSelectedIds: (ids: string[]) => void;
    setCustomItems: (items: string[]) => void;
    hasSystem: boolean;
    // New Props for Scraping
    isScraping: boolean;
    onStartScrape: (url: string, mode: 'standard' | 'deep') => void;
    handleMenuImport: (menu: Ingredient[], presets: Preset[], info?: { phoneNumber?: string, rating?: number, deliveryApps?: string[] }) => void;
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = (props) => {
    const { 
        activeRestaurant, selectedIds, customItems, menu, presets,
        activeMenuVersionId, activeCategory, setActiveCategory,
        setActiveMenuVersionId, toggleIngredient, handleSelectPreset,
        handleAddCustomItem, handleRemoveCustomItem, handleSaveOrder,
        handleApplyAISuggestion, calculateTotalCalories,
        setSelectedIds, setCustomItems, hasSystem, savedMenus,
        isScraping, onStartScrape, handleMenuImport
    } = props;

    // Show Importer if explicitly 'NEW' OR if we have no menu items at all and not scraping
    const showImporter = activeMenuVersionId === 'NEW';
    const savedForRest = savedMenus[activeRestaurant.id] || [];

    const versionOptions: {id: string, label: string}[] = [];
    if (hasSystem) {
        versionOptions.push({ id: 'SYSTEM', label: 'System Default' });
    }
    savedForRest.forEach(m => {
        versionOptions.push({ 
            id: m.id, 
            label: `Scraped: ${new Date(m.timestamp).toLocaleDateString()} ${new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` 
        });
    });

    const restaurantProps = {
        selectedIds,
        customItems,
        onToggleItem: toggleIngredient,
        onSelectPreset: handleSelectPreset,
        onAddCustomItem: handleAddCustomItem,
        onRemoveCustomItem: handleRemoveCustomItem,
        categoryFilter: activeCategory,
        setCategoryFilter: setActiveCategory,
        restaurantName: activeRestaurant.name,
        availableVersions: versionOptions,
        currentVersionId: activeMenuVersionId || '',
        onVersionChange: (id: string) => setActiveMenuVersionId(id),
        onScrapeNew: () => setActiveMenuVersionId('NEW')
    };

    let BuilderContent;
      
    if (showImporter || isScraping) {
        BuilderContent = <MenuImporter 
            restaurant={activeRestaurant} 
            onStartScrape={onStartScrape}
            isScraping={isScraping}
            // If we have other versions, allow cancel to go back to them. If scraping, cancel acts as "Go Back"
            onCancel={versionOptions.length > 0 ? () => setActiveMenuVersionId(versionOptions[0].id) : undefined}
        />;
    } else {
        const isSystemMode = activeMenuVersionId === 'SYSTEM';
        
        if (isSystemMode && activeRestaurant.id === 'cava') BuilderContent = <Cava {...restaurantProps} />;
        else if (isSystemMode && activeRestaurant.id === 'chipotle') BuilderContent = <Chipotle {...restaurantProps} />;
        else if (isSystemMode && activeRestaurant.id === 'sweetgreen') BuilderContent = <Sweetgreen {...restaurantProps} />;
        else if (isSystemMode && activeRestaurant.id === 'jerseymikes') BuilderContent = <JerseyMikes {...restaurantProps} />;
        else if (isSystemMode && activeRestaurant.id === 'josetejas') BuilderContent = <JoseTejas {...restaurantProps} />;
        else if (isSystemMode && activeRestaurant.id === 'shakeshack') BuilderContent = <ShakeShack {...restaurantProps} />;
        else if (isSystemMode && activeRestaurant.id === 'franklin') BuilderContent = <FranklinSteakhouse {...restaurantProps} />;
        else if (isSystemMode && activeRestaurant.id === 'calandras') BuilderContent = <Calandras {...restaurantProps} />;
        else {
             BuilderContent = <BowlBuilder 
                  menu={menu} 
                  presets={presets} 
                  restaurantColor={activeRestaurant.color} 
                  {...restaurantProps} 
             />;
        }
    }

    return (
        <main className="max-w-7xl mx-auto p-2 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            <div className="md:col-span-8 lg:col-span-9 h-[calc(100vh-6rem)] flex flex-col gap-4">
                {/* Waze-like Distance Meter + Info */}
                {!showImporter && !isScraping && <RestaurantDistance 
                    address={activeRestaurant.address} 
                    distance={activeRestaurant.distanceFromRec}
                    phoneNumber={activeRestaurant.phoneNumber}
                    rating={activeRestaurant.rating}
                    deliveryApps={activeRestaurant.deliveryApps}
                />}
                
                <div className="flex-1 overflow-hidden">
                    {BuilderContent}
                </div>
            </div>
            <div className="md:col-span-4 lg:col-span-3 space-y-4">
                {!showImporter && !isScraping && (
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4 md:p-5 sticky top-24">
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                            <h2 className="font-bold text-base md:text-lg">Current Order</h2>
                            {(selectedIds.length > 0 || customItems.length > 0) && (
                                <button onClick={() => { setSelectedIds([]); setCustomItems([]); }} className="text-xs text-stone-400 hover:text-red-500">
                                    Reset
                                </button>
                            )}
                        </div>
                        
                        <div className="space-y-3 mb-4 md:mb-6 max-h-[30vh] md:max-h-[40vh] overflow-y-auto pr-2">
                            {selectedIds.length === 0 && customItems.length === 0 ? (
                                <div className="text-center py-6 md:py-8 text-stone-400">
                                    <Utensils className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs md:text-sm">Select components or add manual entries.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Standard Items */}
                                    {Array.from(new Set(menu.filter((i: Ingredient) => selectedIds.includes(i.id)).map((i: Ingredient) => i.category))).map(cat => (
                                        <div key={String(cat)} className="border-b border-stone-100 last:border-0 pb-2">
                                            <h4 className="text-[10px] md:text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">{cat}</h4>
                                            <ul className="space-y-1">
                                                {menu.filter((i: Ingredient) => i.category === cat && selectedIds.includes(i.id)).map((item: Ingredient) => (
                                                    <li key={item.id} className="text-xs md:text-sm flex justify-between">
                                                        <span>{item.name}</span>
                                                        <button onClick={() => toggleIngredient(item.id)} className="text-stone-300 hover:text-red-500">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}

                                    {/* Custom Items */}
                                    {customItems.length > 0 && (
                                        <div className="border-b border-stone-100 last:border-0 pb-2">
                                            <h4 className="text-[10px] md:text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <PenTool className="w-3 h-3" /> Manual / Mods
                                            </h4>
                                            <ul className="space-y-1">
                                                {customItems.map((item, idx) => (
                                                    <li key={`custom-${idx}`} className="text-xs md:text-sm flex justify-between">
                                                        <span className="italic">{item}</span>
                                                        <button onClick={() => handleRemoveCustomItem(idx)} className="text-stone-300 hover:text-red-500">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-xs md:text-sm font-medium text-stone-500 mb-3 md:mb-4 pt-3 md:pt-4 border-t border-stone-100">
                            <span>Total Energy (Est)</span>
                            <span className="text-stone-900 font-bold">{calculateTotalCalories()} cal</span>
                        </div>

                        <button 
                            onClick={handleSaveOrder}
                            disabled={selectedIds.length === 0 && customItems.length === 0}
                            className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-2.5 md:py-3 rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            <Save className="w-4 h-4" /> Save Config
                        </button>
                    </div>
                )}
                
                {/* Always show AI Assistant, even when scraping */}
                <GeminiAssistant 
                    onApplySuggestion={handleApplyAISuggestion}
                    menu={menu}
                    restaurantName={activeRestaurant.name}
                    variant="embedded"
                    scope="restaurant"
                />
            </div>
        </main>
    );
};
