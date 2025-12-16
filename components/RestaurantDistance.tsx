
import React from 'react';
import { Car, MapPin, Navigation, Phone, Star, Bike } from 'lucide-react';

interface RestaurantDistanceProps {
  address?: string;
  distance?: string;
  phoneNumber?: string;
  rating?: number;
  deliveryApps?: string[];
}

export const RestaurantDistance: React.FC<RestaurantDistanceProps> = ({ 
  address, 
  distance, 
  phoneNumber, 
  rating, 
  deliveryApps 
}) => {
  if (!address) return null;

  return (
    <div className="bg-white border-b border-stone-200 p-3 flex flex-col gap-3">
      {/* Top Row: Distance Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
         <span className="flex items-center gap-1"><Car className="w-3 h-3" /> Delivery Route</span>
         <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Fairfield Rec Center</span>
      </div>
      
      {/* Waze-like meter */}
      <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-30"></div>
        <div className="absolute top-0 left-2/3 -translate-x-1.5 -translate-y-0.5">
             <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                 <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
             </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          
          {/* Distance & Address */}
          <div className="col-span-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-500 fill-current" />
                  <span className="font-bold text-stone-800 text-sm">{distance || 'Calculating...'}</span>
              </div>
              <span className="text-xs text-stone-500 truncate max-w-[200px] text-right">{address}</span>
          </div>

          {/* Rating & Phone */}
          <div className="col-span-2 flex items-center justify-between border-t border-stone-100 pt-2">
             <div className="flex items-center gap-3">
                 {rating && (
                     <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                         <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                         <span className="text-xs font-bold text-amber-700">{rating}</span>
                     </div>
                 )}
                 {phoneNumber && (
                     <a href={`tel:${phoneNumber}`} className="flex items-center gap-1 text-xs text-stone-600 hover:text-blue-600 transition-colors">
                         <Phone className="w-3.5 h-3.5" />
                         <span>{phoneNumber}</span>
                     </a>
                 )}
             </div>
          </div>

          {/* Delivery Apps */}
          {deliveryApps && deliveryApps.length > 0 && (
              <div className="col-span-2 flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                      <Bike className="w-3 h-3" /> Available on:
                  </span>
                  {deliveryApps.map(app => (
                      <span key={app} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium
                          ${app.toLowerCase().includes('uber') ? 'bg-green-50 border-green-200 text-green-700' : 
                            app.toLowerCase().includes('dash') ? 'bg-red-50 border-red-200 text-red-700' :
                            app.toLowerCase().includes('grub') ? 'bg-orange-50 border-orange-200 text-orange-700' :
                            'bg-stone-50 border-stone-200 text-stone-600'}
                      `}>
                          {app}
                      </span>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
};
