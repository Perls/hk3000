
import React, { useMemo, useState } from 'react';
import { Ingredient, Preset } from '../types';
import { Check, Flame, Star, Plus, Trash2, Settings2, Sparkles, Loader2, Share2, History, RefreshCw } from 'lucide-react';
import { generateItemModifications } from '../services/geminiService';

interface BowlBuilderProps {
  menu: Ingredient[];
  presets?: Preset[];
  selectedIds: string[];
  customItems: string[];
  onToggleItem: (id: string) => void;
  onSelectPreset: (preset: Preset) => void;
  onAddCustomItem: (item: string) => void;
  onRemoveCustomItem: (index: number) => void;
  categoryFilter: string | 'ALL';
  setCategoryFilter: (cat: string | 'ALL') => void;
  restaurantColor: string;
  restaurantName?: string;
  
  // New props for versioning
  availableVersions?: {id: string, label: string}[];
  currentVersionId?: string;
  onVersionChange?: (id: string) => void;
  onScrapeNew?: () => void;
}

export const BowlBuilder: React.FC<BowlBuilderProps> = ({
  menu,
  presets,
  selectedIds,
  customItems,
  onToggleItem,
  onSelectPreset,
  onAddCustomItem,
  onRemoveCustomItem,
  categoryFilter,
  setCategoryFilter,
  restaurantColor,
  restaurantName = "Restaurant",
  availableVersions = [],
  currentVersionId,
  onVersionChange,
  onScrapeNew
}) => {
  const [newCustomItem, setNewCustomItem] = useState('');
  
  // Customization State
  const [activeModItem, setActiveModItem] = useState<string | null>(null);
  const [suggestedMods, setSuggestedMods] = useState<Record<string, string[]>>({});
  const [isModLoading, setIsModLoading] = useState(false);
  const [manualModInput, setManualModInput] = useState('');

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'ALL') return menu;
    return menu.filter((item) => item.category === categoryFilter);
  }, [categoryFilter, menu]);

  const categories = useMemo(() => {
      const cats = Array.from(new Set(menu.map(item => item.category)));
      return cats.sort();
  }, [menu]);

  const activeClass = restaurantColor === 'bg-orange-600' ? 'bg-orange-600' : 
                      restaurantColor === 'bg-red-800' ? 'bg-red-800' : 
                      restaurantColor === 'bg-green-700' ? 'bg-green-700' : 
                      restaurantColor === 'bg-blue-700' ? 'bg-blue-700' :
                      restaurantColor === 'bg-yellow-600' ? 'bg-yellow-600' :
                      restaurantColor === 'bg-green-500' ? 'bg-green-500' : 'bg-stone-800';
  
  const handleAddCustom = (e: React.FormEvent) => {
      e.preventDefault();
      if(newCustomItem.trim()) {
          onAddCustomItem(newCustomItem.trim());
          setNewCustomItem('');
      }
  };

  const handleFetchMods = async (item: Ingredient) => {
      if (suggestedMods[item.id]) return; // Already fetched
      setIsModLoading(true);
      const mods = await generateItemModifications(item.name, restaurantName);
      setSuggestedMods(prev => ({...prev, [item.id]: mods}));
      setIsModLoading(false);
  };

  const addModification = (itemName: string, mod: string) => {
      onAddCustomItem(`${itemName}: ${mod}`);
  };

  const handleShareConfig = async () => {
    const selectedNames = menu.filter(i => selectedIds.includes(i.id)).map(i => i.name);
    const allItems = [...selectedNames, ...customItems];
    
    if (allItems.length === 0) {
      alert("Add items to your order before sharing.");
      return;
    }

    const text = `Can you get this for me from ${restaurantName}?\n\n` + 
                 allItems.map(item => `• ${item}`).join('\n') + 
                 `\n\nThanks!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${restaurantName} Order`,
          text: text,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Order request copied to clipboard! You can paste it in a message.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 rounded-xl overflow-hidden shadow-sm border border-stone-200">
      
      {/* Version Control Header */}
      <div className="bg-white border-b border-stone-200 px-3 py-2 flex items-center justify-between">
         <div className="flex items-center gap-2">
             <History className="w-3.5 h-3.5 text-stone-400" />
             <select 
                value={currentVersionId || ''}
                onChange={(e) => onVersionChange && onVersionChange(e.target.value)}
                className="text-xs md:text-sm text-stone-600 bg-transparent border-none font-medium focus:ring-0 cursor-pointer p-0 pr-6 truncate max-w-[200px] md:max-w-xs"
             >
                 {availableVersions.length === 0 && <option value="">No Menus Available</option>}
                 {availableVersions.map(v => (
                     <option key={v.id} value={v.id}>{v.label}</option>
                 ))}
                 <option value="NEW" disabled>--</option>
             </select>
         </div>
         {onScrapeNew && (
             <button 
                onClick={onScrapeNew}
                className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
             >
                 <RefreshCw className="w-3 h-3" /> Scrape New
             </button>
         )}
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto bg-white border-b border-stone-200 p-1.5 md:p-2 gap-1.5 md:gap-2 no-scrollbar shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {presets && presets.length > 0 && (
            <button
            onClick={() => setCategoryFilter('PRESETS')}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                categoryFilter === 'PRESETS'
                ? `${activeClass} text-white`
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
            >
            <Star className="w-3 h-3" /> <span className="hidden sm:inline">Curated Bowls</span><span className="sm:hidden">Presets</span>
            </button>
        )}
        <button
          onClick={() => setCategoryFilter('ALL')}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
            categoryFilter === 'ALL'
              ? `${activeClass} text-white`
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? `${activeClass} text-white`
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 md:space-y-6">
        
        {/* Manual Additions */}
        {categoryFilter === 'ALL' && (
            <div className="bg-white p-3 md:p-4 rounded-xl border border-dashed border-stone-300">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs md:text-sm font-bold text-stone-700 flex items-center gap-2">
                        <Plus className="w-3 h-3 md:w-4 md:h-4" /> Manual Additions
                    </h3>
                    {(selectedIds.length > 0 || customItems.length > 0) && (
                         <button 
                            onClick={handleShareConfig}
                            className="text-[10px] md:text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                         >
                            <Share2 className="w-3 h-3" /> Share Request
                         </button>
                    )}
                </div>
                
                <form onSubmit={handleAddCustom} className="flex gap-2 mb-3">
                    <input 
                        type="text" 
                        value={newCustomItem}
                        onChange={(e) => setNewCustomItem(e.target.value)}
                        placeholder="Add special request..."
                        className="flex-1 border border-stone-200 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm focus:ring-2 focus:ring-stone-400 focus:outline-none"
                    />
                    <button 
                        type="submit"
                        className="bg-stone-800 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-stone-900"
                    >
                        Add
                    </button>
                </form>
                {customItems.length > 0 && (
                    <ul className="space-y-1.5 md:space-y-2">
                        {customItems.map((item, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-stone-50 p-1.5 md:p-2 rounded-lg border border-stone-100">
                                <span className="text-xs md:text-sm text-stone-800">{item}</span>
                                <button onClick={() => onRemoveCustomItem(idx)} className="text-stone-400 hover:text-red-500">
                                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )}

        {/* Presets Grid */}
        {categoryFilter === 'PRESETS' && presets ? (
            <div className="grid grid-cols-1 gap-2 md:gap-3">
                {presets.map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => onSelectPreset(preset)}
                        className="text-left p-3 md:p-4 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-sm md:text-base text-stone-900 group-hover:text-orange-600">{preset.name}</h3>
                            <span className="text-xs md:text-sm font-medium text-stone-600">${preset.price}</span>
                        </div>
                        <p className="text-[10px] md:text-xs text-stone-500 mb-1.5 md:mb-2">{preset.calories} Calories</p>
                        <p className="text-xs md:text-sm text-stone-600">{preset.description}</p>
                        <div className="mt-2 md:mt-3 text-[10px] md:text-xs text-stone-400 uppercase tracking-wider font-semibold group-hover:text-orange-500">
                            Load Menu
                        </div>
                    </button>
                ))}
            </div>
        ) : (
            /* Ingredients Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isModifying = activeModItem === item.id;
                
                return (
                <div key={item.id} className="relative">
                <button
                    onClick={() => onToggleItem(item.id)}
                    className={`relative w-full group text-left p-3 md:p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                        ? `border-current bg-stone-50 shadow-md ring-1 ring-current text-stone-900`
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
                    }`}
                    style={isSelected ? { borderColor: 'currentColor', color: 'inherit' } : {}}
                >
                     <div className={`absolute inset-0 rounded-xl border pointer-events-none ${isSelected ? `border-current opacity-100` : 'border-transparent'}`}></div>
                     
                    <div className="flex justify-between items-start mb-0.5 md:mb-1 relative z-10">
                    <span className={`font-semibold text-xs md:text-sm ${isSelected ? 'text-stone-900' : 'text-stone-800'}`}>
                        {item.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-stone-900" />}
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-stone-500 mb-1.5 md:mb-2 relative z-10">
                    <span>{item.calories} cal</span>
                    {item.premium && <span className="text-amber-600 font-medium px-1.5 py-0.5 bg-amber-100 rounded text-[10px]">Premium</span>}
                    </div>

                    {item.description && (
                    <p className="text-[10px] md:text-xs text-stone-400 line-clamp-2 relative z-10">{item.description}</p>
                    )}
                    
                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {(item.name.toLowerCase().includes('spicy') || item.name.includes('Harissa') || item.name.includes('Skhug') || item.name.includes('Hot')) && (
                            <Flame className="w-3 h-3 text-red-500" />
                        )}
                    </div>
                </button>

                {/* Customization Toggle */}
                {isSelected && (
                    <div className="absolute top-2 right-2 z-20">
                         {/* We handle customization below */}
                    </div>
                )}
                
                {/* Customization Panel */}
                {isSelected && (
                    <div className="mt-1 pl-4 pr-1">
                        {!isModifying ? (
                            <button 
                                onClick={() => setActiveModItem(item.id)}
                                className="text-[10px] md:text-xs flex items-center gap-1 text-stone-400 hover:text-blue-600 transition-colors"
                            >
                                <Settings2 className="w-3 h-3" /> Customize
                            </button>
                        ) : (
                            <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-lg z-30 relative animate-in fade-in slide-in-from-top-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-stone-700">Options for {item.name}</span>
                                    <button onClick={() => setActiveModItem(null)} className="text-stone-400 hover:text-stone-600">
                                        <Check className="w-3 h-3" />
                                    </button>
                                </div>
                                
                                {/* Manual Input */}
                                <div className="flex gap-1 mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Note..." 
                                        className="flex-1 text-xs border border-stone-300 rounded px-2 py-1"
                                        value={manualModInput}
                                        onChange={(e) => setManualModInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && manualModInput.trim()) {
                                                addModification(item.name, manualModInput.trim());
                                                setManualModInput('');
                                            }
                                        }}
                                    />
                                    <button 
                                        onClick={() => {
                                            if (manualModInput.trim()) {
                                                addModification(item.name, manualModInput.trim());
                                                setManualModInput('');
                                            }
                                        }}
                                        className="bg-stone-800 text-white p-1 rounded hover:bg-stone-700"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* AI Suggestions */}
                                {suggestedMods[item.id] ? (
                                    <div className="space-y-1">
                                        {suggestedMods[item.id].map((mod, i) => (
                                            <label key={i} className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer hover:bg-stone-50 p-1 rounded">
                                                <input 
                                                    type="checkbox" 
                                                    onChange={(e) => {
                                                        if (e.target.checked) addModification(item.name, mod);
                                                    }}
                                                    className="rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                {mod}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleFetchMods(item)}
                                        disabled={isModLoading}
                                        className="w-full py-1 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100 flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors"
                                    >
                                        {isModLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        Suggest Options
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
                </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
};
