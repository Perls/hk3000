
import React, { useState } from 'react';
import { Star, Dices, Sparkles, MapPin, History, Plus, Loader2 } from 'lucide-react';
import { Restaurant, Order } from '../types';
import { AddRestaurantModal } from './AddRestaurantModal';

interface HomeViewProps {
    favoritesList: Restaurant[];
    exploreList: Restaurant[];
    savedOrders: Order[];
    allRestaurants: Restaurant[];
    highlightedId: string | null;
    isRandomizing: boolean;
    onRandomPick: () => void;
    onSelectRestaurant: (id: string) => void;
    onLoadOrder: (order: Order) => void;
    onViewSaves: () => void;
    onAddRestaurant: (r: Restaurant) => void;
    scrapingIds: Set<string>;
}

export const HomeView: React.FC<HomeViewProps> = ({
    favoritesList,
    exploreList,
    savedOrders,
    allRestaurants,
    highlightedId,
    isRandomizing,
    onRandomPick,
    onSelectRestaurant,
    onLoadOrder,
    onViewSaves,
    onAddRestaurant,
    scrapingIds
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <main className="max-w-6xl mx-auto p-3 md:p-8 space-y-8 md:space-y-12 pb-24">
            
        {/* Favorites Section */}
        <section>
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2 text-stone-500">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                    <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider">Favorites</h2>
                </div>
                <button 
                    onClick={onRandomPick}
                    disabled={isRandomizing}
                    className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-stone-900 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-stone-800 transition-colors disabled:opacity-50 shadow-sm"
                >
                    {isRandomizing ? <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> : <Dices className="w-3 h-3 md:w-4 md:h-4" />}
                    Random Pick
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {favoritesList.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-sm">
                        No favorites selected. Add some from the Explore list below!
                    </div>
                ) : favoritesList.map(r => {
                    const isHighlighted = highlightedId === r.id;
                    const isWinner = !isRandomizing && highlightedId === r.id; 
                    const isScraping = scrapingIds.has(r.id);

                    return (
                        <button 
                            key={r.id}
                            onClick={() => {
                                if (!isRandomizing) {
                                    onSelectRestaurant(r.id);
                                }
                            }}
                            disabled={isRandomizing}
                            className={`group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border text-left h-32 md:h-40 flex flex-col justify-between p-4 md:p-6
                                ${isHighlighted 
                                    ? 'border-blue-500 ring-4 ring-blue-500 ring-opacity-20 scale-105 z-10 shadow-xl' 
                                    : 'border-stone-200 hover:border-stone-300 hover:shadow-xl'
                                }
                                ${isWinner ? 'animate-bounce border-green-500 ring-4 ring-green-500 ring-opacity-50' : ''}
                            `}
                        >
                            <div className={`absolute top-0 left-0 w-1.5 md:w-2 h-full ${r.color}`}></div>
                            
                            {/* Loading Overlay */}
                            {isScraping && (
                                <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider animate-pulse">Updating...</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-[width_2s_ease-in-out_infinite] w-full"></div>
                                </div>
                            )}

                            <div>
                                <span className={`text-2xl md:text-3xl mb-1 md:mb-2 block group-hover:scale-110 transition-transform duration-300 ${isScraping ? 'opacity-50' : ''}`}>{r.logo}</span>
                                <h3 className="text-base md:text-lg font-bold text-stone-800 group-hover:text-stone-900">{r.name}</h3>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-mono text-stone-400 uppercase">Verified Menu</span>
                                {r.distanceFromRec && <span className="text-[10px] text-stone-400">{r.distanceFromRec} away</span>}
                            </div>
                            {isWinner && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm">
                                    <div className="bg-stone-900 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
                                        WINNER!
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>

        {/* Explore Fairfield Section */}
        <section>
            <div className="flex items-center gap-2 mb-4 md:mb-6 text-stone-500">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider">Explore Fairfield, NJ</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                {exploreList.map(r => {
                    const isScraping = scrapingIds.has(r.id);
                    return (
                        <button 
                            key={r.id}
                            onClick={() => {
                                if (isRandomizing) return;
                                onSelectRestaurant(r.id);
                            }}
                            className="bg-white rounded-lg p-2 md:p-3 border border-stone-200 hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col gap-1 relative overflow-hidden"
                        >
                             {isScraping && (
                                <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
                                     <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 md:gap-3">
                                <span className="text-lg md:text-xl bg-stone-100 p-1 rounded">{r.logo}</span>
                                <span className="text-xs md:text-sm font-medium text-stone-700 truncate">{r.name}</span>
                            </div>
                            {r.distanceFromRec && <span className="text-[10px] text-stone-400 pl-1">{r.distanceFromRec}</span>}
                        </button>
                    );
                })}
            </div>
        </section>

        {/* Saved Orders Teaser */}
        <section>
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2 text-stone-500">
                    <History className="w-4 h-4 md:w-5 md:h-5" />
                    <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider">Recent Memory</h2>
                </div>
                <button 
                    onClick={onViewSaves}
                    className="text-xs md:text-sm text-stone-500 hover:text-stone-900 underline"
                >
                    View All
                </button>
            </div>
            
            {savedOrders.length === 0 ? (
                    <div className="p-6 md:p-8 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center text-stone-500 text-xs md:text-sm">
                    No recent configurations.
                    </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {savedOrders.slice(0, 3).map(order => {
                            const r = allRestaurants.find(rest => rest.id === order.restaurantId);
                            return (
                                <button 
                                key={order.id}
                                onClick={() => onLoadOrder(order)}
                                className="bg-white p-3 md:p-4 rounded-xl border border-stone-200 hover:shadow-md transition-all text-left"
                                >
                                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                                        <span className="text-lg md:text-xl">{r?.logo}</span>
                                        <span className="font-bold text-sm md:text-base text-stone-800 truncate">{order.name}</span>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-stone-500 truncate">{new Date(order.timestamp).toLocaleDateString()}</p>
                                </button>
                            )
                    })}
                </div>
            )}
        </section>

        {/* Floating Add Button (Mobile) or Bottom Section (Desktop) */}
        <div className="fixed bottom-6 right-6 md:relative md:bottom-auto md:right-auto md:flex md:justify-center">
             <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-full shadow-xl hover:bg-stone-800 transition-transform hover:scale-105"
             >
                 <Plus className="w-5 h-5" />
                 <span className="font-bold">Add New Spot</span>
             </button>
        </div>

        {showAddModal && (
            <AddRestaurantModal 
                onClose={() => setShowAddModal(false)}
                onAdd={(r) => {
                    onAddRestaurant(r);
                    setShowAddModal(false);
                }}
            />
        )}
    </main>
  );
};
