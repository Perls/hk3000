import React, { useState, useEffect } from 'react';
import { Order, Restaurant } from '../types';
import { Copy, Trash2, ArrowRight, ShoppingBag, ArrowLeft, History, Save, X, Share2, MessageSquare } from 'lucide-react';
import { ALL_INGREDIENTS } from '../constants';

interface SavesMenuProps {
  orders: Order[];
  restaurants: Restaurant[];
  onLoadOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  onBack: () => void;
  pendingOrder: {
    restaurantId: string;
    items: string[];
    customItems: string[];
  } | null;
  onConfirmSave: (name: string, creator: string) => void;
  onCancelSave: () => void;
}

export const SavesMenu: React.FC<SavesMenuProps> = ({
  orders,
  restaurants,
  onLoadOrder,
  onDeleteOrder,
  onBack,
  pendingOrder,
  onConfirmSave,
  onCancelSave
}) => {
  const [saveName, setSaveName] = useState('');
  const [saveCreator, setSaveCreator] = useState('');

  useEffect(() => {
    if (pendingOrder) {
      const r = restaurants.find(x => x.id === pendingOrder.restaurantId);
      setSaveName(`${r?.name || 'My'} Order`);
      setSaveCreator('Me');
    }
  }, [pendingOrder, restaurants]);

  const getIngredientNames = (ids: string[]) => {
    return ids
      .map((id) => ALL_INGREDIENTS.find((i) => i.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getFullSummaryFromData = (items: string[], customItems: string[]) => {
      let text = getIngredientNames(items);
      if (customItems && customItems.length > 0) {
          if (text) text += ', ';
          text += customItems.map(i => `${i} (Manual)`).join(', ');
      }
      return text;
  };

  const getFullSummary = (order: Order) => {
      return getFullSummaryFromData(order.items, order.customItems || []);
  };

  const getRestaurant = (id: string) => restaurants.find(r => r.id === id);

  const handleCopySummary = (order: Order) => {
      const r = getRestaurant(order.restaurantId);
      const summary = `${r?.name || 'Food'} Order: ${order.name}\nIngredients: ${getFullSummary(order)}`;
      navigator.clipboard.writeText(summary);
      alert("Order summary copied to clipboard!");
  };

  const handleShareOrder = async (order: Order) => {
    const r = getRestaurant(order.restaurantId);
    
    // Construct a friendly message
    const ingredients = order.items.map((id) => ALL_INGREDIENTS.find((i) => i.id === id)?.name).filter(Boolean);
    const manual = order.customItems || [];
    
    const itemList = [...ingredients, ...manual].map(i => `• ${i}`).join('\n');
    
    const text = `Hey, can you grab this for me from ${r?.name}?\n\n` + 
                 `Order: ${order.name}\n` + 
                 `${itemList}\n\n` + 
                 `Thanks!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order for ${r?.name}`,
          text: text
        });
      } catch (e) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Order request copied to clipboard! You can paste it to a friend.");
    }
  };

  const handleOpenRestaurant = (order: Order) => {
      const r = getRestaurant(order.restaurantId);
      if (r?.url) {
          window.open(r.url, '_blank');
      } else {
          alert("No ordering link available for this restaurant.");
      }
  };

  // If we are in "Saving Mode"
  if (pendingOrder) {
    const r = getRestaurant(pendingOrder.restaurantId);
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-stone-900 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Save className="w-5 h-5 text-stone-400" />
              Save Configuration
            </h2>
            <button onClick={onCancelSave} className="text-stone-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{r?.logo}</span>
                <span className="font-bold text-stone-800">{r?.name}</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed max-h-32 overflow-y-auto">
                {getFullSummaryFromData(pendingOrder.items, pendingOrder.customItems)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Configuration Name
                </label>
                <input 
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all font-medium"
                  placeholder="e.g. My Favorite Bowl"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Creator Name
                </label>
                <input 
                  type="text"
                  value={saveCreator}
                  onChange={(e) => setSaveCreator(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-all font-medium"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={onCancelSave}
                className="flex-1 py-3 text-stone-600 font-bold hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => onConfirmSave(saveName, saveCreator)}
                disabled={!saveName.trim() || !saveCreator.trim()}
                className="flex-1 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal List View
  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 bg-white rounded-full text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
             <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <History className="w-6 h-6 text-stone-500" />
                System Memory
             </h1>
             <p className="text-stone-500 text-sm">Manage your saved configurations</p>
          </div>
        </div>

        {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-dashed border-stone-300 shadow-sm">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Memory Empty</h3>
                <p className="text-stone-500 mb-6">You haven't saved any order configurations yet.</p>
                <button 
                    onClick={onBack}
                    className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                >
                    Return to Hub
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => {
                const r = getRestaurant(order.restaurantId);
                return (
                    <div
                    key={order.id}
                    className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group"
                    >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl bg-stone-50 p-2 rounded-lg">{r?.logo}</span>
                            <div>
                                <h3 className="font-bold text-lg text-stone-800 leading-tight group-hover:text-blue-600 transition-colors">{order.name}</h3>
                                <span className="text-xs text-stone-400 font-mono flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${r?.color || 'bg-gray-400'}`}></span>
                                    {r?.name} • {order.creator} • {new Date(order.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onDeleteOrder(order.id)}
                                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete from Memory"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-stone-50 rounded-lg p-3 mb-4 border border-stone-100">
                         <p className="text-sm text-stone-600 leading-relaxed">
                            {getFullSummary(order)}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                        onClick={() => onLoadOrder(order)}
                        className="flex-1 flex items-center justify-center gap-2 bg-stone-100 text-stone-700 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-stone-200 transition-colors shadow-sm"
                        >
                        <ArrowRight className="w-4 h-4" /> Load
                        </button>
                        <button
                            onClick={() => handleShareOrder(order)}
                            className="flex items-center justify-center px-4 bg-white border border-stone-200 hover:border-green-300 hover:text-green-600 rounded-lg text-stone-600 transition-colors flex gap-2 font-medium"
                            title="Share with someone"
                        >
                            <MessageSquare className="w-4 h-4" /> Ask Someone
                        </button>
                        <button
                            onClick={() => handleOpenRestaurant(order)}
                            className="flex items-center justify-center px-4 bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-colors flex gap-2 font-medium"
                            title={`Order on ${r?.name}`}
                        >
                            <ShoppingBag className="w-4 h-4" /> Order
                        </button>
                    </div>
                    </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
};