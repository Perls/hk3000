import React from 'react';
import { Order, Restaurant } from '../types';
import { Copy, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { ALL_INGREDIENTS } from '../constants';

interface SavedOrdersListProps {
  orders: Order[];
  restaurants: Restaurant[];
  onLoadOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
}

export const SavedOrdersList: React.FC<SavedOrdersListProps> = ({
  orders,
  restaurants,
  onLoadOrder,
  onDeleteOrder,
}) => {
  const getIngredientNames = (ids: string[]) => {
    return ids
      .map((id) => ALL_INGREDIENTS.find((i) => i.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getFullSummary = (order: Order) => {
      let text = getIngredientNames(order.items);
      if (order.customItems && order.customItems.length > 0) {
          if (text) text += ', ';
          text += order.customItems.map(i => `${i} (Manual)`).join(', ');
      }
      return text;
  };

  const getRestaurant = (id: string) => restaurants.find(r => r.id === id);

  const handleCopySummary = (order: Order) => {
      const r = getRestaurant(order.restaurantId);
      const summary = `${r?.name || 'Food'} Order: ${order.name}\nIngredients: ${getFullSummary(order)}`;
      navigator.clipboard.writeText(summary);
      alert("Order summary copied to clipboard!");
  };

  const handleOpenRestaurant = (order: Order) => {
      const r = getRestaurant(order.restaurantId);
      if (r?.url) {
          window.open(r.url, '_blank');
      } else {
          alert("No ordering link available for this restaurant.");
      }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
        <p className="text-stone-500 font-medium">Memory bank empty.</p>
        <p className="text-xs text-stone-400 mt-1">Initialize a new order sequence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const r = getRestaurant(order.restaurantId);
        return (
            <div
            key={order.id}
            className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{r?.logo}</span>
                    <div>
                        <h3 className="font-bold text-stone-800 leading-tight">{order.name}</h3>
                        <span className="text-xs text-stone-400 font-mono">
                            {r?.name} • {order.creator} • {new Date(order.timestamp).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => onDeleteOrder(order.id)}
                        className="p-1.5 text-stone-400 hover:text-red-500 rounded-md hover:bg-stone-50"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <p className="text-sm text-stone-600 line-clamp-2 mb-4 pl-9">
                {getFullSummary(order)}
            </p>

            <div className="flex gap-2 pl-9">
                <button
                onClick={() => onLoadOrder(order)}
                className="flex-1 flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 px-3 rounded-lg text-xs font-semibold transition-colors"
                >
                Load Config <ArrowRight className="w-3 h-3" />
                </button>
                <button
                    onClick={() => handleCopySummary(order)}
                    className="flex items-center justify-center p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-600 transition-colors"
                    title="Copy Summary"
                >
                    <Copy className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleOpenRestaurant(order)}
                    className="flex items-center justify-center p-2 bg-stone-900 hover:bg-stone-700 text-white rounded-lg transition-colors"
                    title={`Go to ${r?.name}`}
                >
                    <ShoppingBag className="w-4 h-4" />
                </button>
            </div>
            </div>
        );
      })}
    </div>
  );
};
