
import React from 'react';
import { User, Archive, ChevronLeft, Star, History } from 'lucide-react';

interface HeaderProps {
    viewMode: 'HOME' | 'BUILDER' | 'SAVES';
    onHome: () => void;
    onSaves: () => void;
    userName: string;
    setUserName: (name: string) => void;
    activeRestaurant?: { name: string, logo: string, id: string };
    onToggleFavorite?: (id: string) => void;
    isFavorite?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
    viewMode, onHome, onSaves, userName, setUserName, activeRestaurant, onToggleFavorite, isFavorite 
}) => {
    
    // Home Header
    if (viewMode === 'HOME') {
        return (
            <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-3 md:px-4 h-16 md:h-20 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white font-mono">HICKORY TERRACE</h1>
                        <p className="text-stone-400 text-[10px] md:text-xs tracking-widest uppercase">Food Ordering System 3000</p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button 
                            onClick={onSaves}
                            className="text-stone-300 hover:text-white flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium mr-2 md:mr-4"
                        >
                            <Archive className="w-3.5 h-3.5 md:w-4 md:h-4" /> Saves
                        </button>
                        <div className="flex items-center bg-stone-800 rounded-full px-2 py-0.5 md:px-3 md:py-1 border border-stone-700">
                            <User className="w-3 h-3 md:w-4 md:h-4 text-stone-400 mr-1 md:mr-2" />
                            <select 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="bg-transparent border-none text-xs md:text-sm font-medium focus:ring-0 text-stone-300 cursor-pointer p-0"
                            >
                                <option value="David">David</option>
                                <option value="Camille">Camille</option>
                                <option value="Frenchie">Frenchie</option>
                                <option value="Guest">Guest</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    // Builder/Detail Header
    return (
        <header className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
            <div className="max-w-7xl mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                    <button 
                        onClick={onHome}
                        className="p-1.5 md:p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
                        title="Return to Hub"
                    >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    {activeRestaurant && (
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xl md:text-2xl">{activeRestaurant.logo}</span>
                            <h1 className="text-lg md:text-xl font-bold tracking-tight text-stone-800 line-clamp-1">
                                {activeRestaurant.name}
                            </h1>
                            {onToggleFavorite && (
                                <button 
                                    onClick={() => onToggleFavorite(activeRestaurant.id)}
                                    className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'bg-amber-100 text-amber-500 hover:bg-amber-200' : 'bg-stone-100 text-stone-400 hover:text-stone-600 hover:bg-stone-200'}`}
                                >
                                    <Star className={`w-3 h-3 md:w-4 md:h-4 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onSaves}
                        className="text-stone-500 hover:text-stone-900 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium"
                    >
                        <History className="w-3.5 h-3.5 md:w-4 md:h-4" /> Saves
                    </button>
                </div>
            </div>
        </header>
    );
};
