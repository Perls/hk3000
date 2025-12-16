
import React, { useState } from 'react';
import { X, MapPin, Store } from 'lucide-react';
import { Restaurant } from '../types';

interface AddRestaurantModalProps {
  onClose: () => void;
  onAdd: (r: Restaurant) => void;
}

export const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('🍽️');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRestaurant: Restaurant = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      logo: logo,
      color: 'bg-indigo-600', // Default color
      address: address.trim() || 'Fairfield, NJ',
      distanceFromRec: '1.5 mi', // Default mock distance
      menu: [],
      presets: []
    };

    onAdd(newRestaurant);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-stone-200 bg-stone-50">
          <h2 className="font-bold text-lg text-stone-800">Add New Restaurant</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Name</label>
            <div className="relative">
                <Store className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Tony's Pizza"
                    required
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Address / Location</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input 
                    type="text" 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 123 Main St"
                />
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Icon (Emoji)</label>
             <input 
                type="text" 
                value={logo}
                onChange={e => setLogo(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 🍕"
             />
          </div>

          <button 
            type="submit" 
            className="w-full bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-stone-800 transition-colors mt-2"
          >
            Create Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};
