
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SavesMenu } from './components/SavesMenu';
import { GeminiAssistant } from './components/GeminiAssistant';
import { BowlBuilder } from './components/BowlBuilder';
import { MenuImporter } from './components/MenuImporter';
import { Cava } from './components/restaurants/Cava';
import { Chipotle } from './components/restaurants/Chipotle';
import { Sweetgreen } from './components/restaurants/Sweetgreen';
import { JerseyMikes } from './components/restaurants/JerseyMikes';
import { JoseTejas } from './components/restaurants/JoseTejas';
import { ShakeShack } from './components/restaurants/ShakeShack';
import { FranklinSteakhouse } from './components/restaurants/FranklinSteakhouse';
import { Calandras } from './components/restaurants/Calandras';
import { Order, AIOrderSuggestion, Preset, Ingredient, SavedMenu } from './types';
import { RESTAURANTS } from './constants';
import { FAIRFIELD_RESTAURANTS } from './data/fairfield';
import { Save, User, Utensils, X, ChevronLeft, History, PenTool, MapPin, Star, Archive, Dices, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [viewMode, setViewMode] = useState<'HOME' | 'BUILDER' | 'SAVES'>('HOME');
  
  // Data State
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [savedOrders, setSavedOrders] = useState<Order[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | 'ALL'>('PRESETS'); 
  const [userName, setUserName] = useState('David');

  // Menu Versioning State
  const [savedMenus, setSavedMenus] = useState<Record<string, SavedMenu[]>>({});
  const [activeMenuVersionId, setActiveMenuVersionId] = useState<string | 'SYSTEM' | 'NEW' | null>(null);

  // Pending Save State
  const [pendingSaveOrder, setPendingSaveOrder] = useState<{
      restaurantId: string;
      items: string[];
      customItems: string[];
  } | null>(null);

  // Favorites State
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    return new Set(RESTAURANTS.map(r => r.id));
  });

  // Random Pick State
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Load Saved Orders & Menus
  useEffect(() => {
    const saved = localStorage.getItem('hickory_saved_orders');
    if (saved) {
      try {
        setSavedOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load orders");
      }
    }
    
    const savedMenusRaw = localStorage.getItem('hickory_saved_menus');
    if (savedMenusRaw) {
        try {
            setSavedMenus(JSON.parse(savedMenusRaw));
        } catch (e) {
            console.error("Failed to load menus");
        }
    }
  }, []);

  const saveToStorage = (orders: Order[]) => {
    localStorage.setItem('hickory_saved_orders', JSON.stringify(orders));
  };

  const saveMenusToStorage = (menus: Record<string, SavedMenu[]>) => {
      localStorage.setItem('hickory_saved_menus', JSON.stringify(menus));
  };

  // Helpers
  const allRestaurants = useMemo(() => [...RESTAURANTS, ...FAIRFIELD_RESTAURANTS], []);
  
  const activeRestaurant = useMemo(() => 
    allRestaurants.find(r => r.id === activeRestaurantId), 
  [activeRestaurantId, allRestaurants]);

  const favoritesList = useMemo(() => 
    allRestaurants.filter(r => favoriteIds.has(r.id)),
  [allRestaurants, favoriteIds]);

  const exploreList = useMemo(() => 
    allRestaurants.filter(r => !favoriteIds.has(r.id)),
  [allRestaurants, favoriteIds]);

  const toggleFavorite = (id: string) => {
      const newSet = new Set(favoriteIds);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setFavoriteIds(newSet);
  };

  // Sound Effects Generator
  const playSound = (type: 'tick' | 'win') => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'tick') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } else {
        // Win sound (Major arpeggio)
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.connect(g);
            g.connect(ctx.destination);
            o.frequency.value = freq;
            g.gain.setValueAtTime(0, now + i * 0.1);
            g.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
            o.start(now + i * 0.1);
            o.stop(now + i * 0.1 + 0.5);
        });
    }
  };

  // Roulette Logic
  const handleRandomPick = () => {
    if (isRandomizing) return;
    if (favoritesList.length < 2) {
        alert("Add more favorites to play Random Pick!");
        return;
    }
    setIsRandomizing(true);
    
    let spins = 0;
    const maxSpins = 25; // How many jumps before stopping
    let currentInterval = 50; // Starting speed (ms)
    
    const pool = favoritesList.map(r => r.id);

    const spin = () => {
        // Pick random index
        const randomIndex = Math.floor(Math.random() * pool.length);
        const randomId = pool[randomIndex];
        setHighlightedId(randomId);
        playSound('tick');

        spins++;

        if (spins < maxSpins) {
            // Slow down exponentially
            currentInterval = currentInterval * 1.1; 
            setTimeout(spin, currentInterval);
        } else {
            // Winner!
            playSound('win');
            setTimeout(() => {
                setIsRandomizing(false);
                setHighlightedId(null); // Clear highlight
                
                // Navigate to winner
                handleRestaurantSelect(randomId);
            }, 1500); // Wait 1.5s to celebrate before navigating
        }
    };

    spin();
  };

  const handleRestaurantSelect = (id: string) => {
      setActiveRestaurantId(id);
      setSelectedIds([]);
      setCustomItems([]);
      
      // Determine initial version
      const existing = savedMenus[id];
      const rest = allRestaurants.find(r => r.id === id);
      const isSystem = RESTAURANTS.some(r => r.id === id); // Has hardcoded data

      if (existing && existing.length > 0) {
          // Default to latest scraped
          setActiveMenuVersionId(existing[0].id);
          setActiveCategory(existing[0].presets.length > 0 ? 'PRESETS' : 'ALL');
      } else if (isSystem) {
          setActiveMenuVersionId('SYSTEM');
          setActiveCategory(rest?.presets && rest.presets.length > 0 ? 'PRESETS' : 'ALL');
      } else {
          setActiveMenuVersionId('NEW'); // Show importer
      }
      
      setViewMode('BUILDER');
  };

  const toggleIngredient = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectPreset = (preset: Preset) => {
      setSelectedIds(preset.itemIds);
      setCustomItems([]); 
      setActiveCategory('ALL'); 
  };
  
  const handleAddCustomItem = (item: string) => {
      setCustomItems(prev => [...prev, item]);
  };
  
  const handleRemoveCustomItem = (index: number) => {
      setCustomItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveOrder = () => {
    if (!activeRestaurantId || !activeRestaurant) return;
    if (selectedIds.length === 0 && customItems.length === 0) {
        alert("Order is empty. Select items or add manual entries.");
        return;
    }

    setPendingSaveOrder({
        restaurantId: activeRestaurantId,
        items: selectedIds,
        customItems: customItems
    });
    setViewMode('SAVES');
  };

  const handleConfirmSave = (name: string, creator: string) => {
    if (!pendingSaveOrder) return;

    const newOrder: Order = {
      id: crypto.randomUUID(),
      restaurantId: pendingSaveOrder.restaurantId,
      name,
      creator,
      items: pendingSaveOrder.items,
      customItems: pendingSaveOrder.customItems,
      timestamp: Date.now(),
    };

    const updatedOrders = [newOrder, ...savedOrders];
    setSavedOrders(updatedOrders);
    saveToStorage(updatedOrders);
    
    setPendingSaveOrder(null);
    setActiveRestaurantId(null);
  };

  const handleCancelSave = () => {
      if (activeRestaurantId) {
          setViewMode('BUILDER');
      } else {
          setPendingSaveOrder(null);
      }
  };

  const handleDeleteOrder = (id: string) => {
    const updated = savedOrders.filter(o => o.id !== id);
    setSavedOrders(updated);
    saveToStorage(updated);
  };

  const handleLoadOrder = (order: Order) => {
    handleRestaurantSelect(order.restaurantId);
    // Overwrite defaults from handleRestaurantSelect
    setSelectedIds(order.items);
    setCustomItems(order.customItems || []);
    setActiveCategory('ALL');
  };

  const handleApplyAISuggestion = (suggestion: AIOrderSuggestion) => {
    setSelectedIds(suggestion.itemIds);
    setCustomItems([]); 
    alert(`System Logic: ${suggestion.reasoning}`);
  };

  // --- Dynamic Menu Logic ---
  
  const handleMenuImport = (menu: Ingredient[], presets: Preset[]) => {
      if (!activeRestaurantId) return;

      const newMenu: SavedMenu = {
          id: crypto.randomUUID(),
          restaurantId: activeRestaurantId,
          timestamp: Date.now(),
          menu,
          presets,
          sourceUrl: '' // In a real app we'd pass this from Importer
      };

      const existingForRest = savedMenus[activeRestaurantId] || [];
      const updated = {
          ...savedMenus,
          [activeRestaurantId]: [newMenu, ...existingForRest]
      };
      
      setSavedMenus(updated);
      saveMenusToStorage(updated);
      setActiveMenuVersionId(newMenu.id);
      setActiveCategory('ALL');
  };

  // Helper to determine active menu data
  const getActiveMenuData = () => {
      if (!activeRestaurantId) return { menu: [], presets: [] };

      // Case 1: Saved Menu selected
      if (activeMenuVersionId && activeMenuVersionId !== 'SYSTEM' && activeMenuVersionId !== 'NEW') {
          const menus = savedMenus[activeRestaurantId];
          const found = menus?.find(m => m.id === activeMenuVersionId);
          if (found) return { menu: found.menu, presets: found.presets };
      }

      // Case 2: System Default
      const systemRest = RESTAURANTS.find(r => r.id === activeRestaurantId);
      if (systemRest) return { menu: systemRest.menu, presets: systemRest.presets || [] };

      // Case 3: Nothing available (Implying NEW)
      return { menu: [], presets: [] };
  };

  const calculateTotalCalories = () => {
    if (!activeRestaurant) return 0;
    const { menu } = getActiveMenuData();
    
    return selectedIds.reduce((acc, id) => {
      const item = menu.find((i: Ingredient) => i.id === id);
      return acc + (item?.calories || 0);
    }, 0);
  };

  // --- Views ---

  // 1. Saves Menu View
  if (viewMode === 'SAVES') {
      return (
          <SavesMenu 
            orders={savedOrders}
            restaurants={allRestaurants}
            onLoadOrder={handleLoadOrder}
            onDeleteOrder={handleDeleteOrder}
            onBack={() => setViewMode('HOME')}
            pendingOrder={pendingSaveOrder}
            onConfirmSave={handleConfirmSave}
            onCancelSave={handleCancelSave}
          />
      );
  }

  // 2. Builder View
  if (viewMode === 'BUILDER' && activeRestaurant) {
      
      const { menu: currentMenu, presets: currentPresets } = getActiveMenuData();
      const showImporter = activeMenuVersionId === 'NEW';
      
      // Determine available versions for Dropdown
      const savedForRest = savedMenus[activeRestaurant.id] || [];
      const hasSystem = RESTAURANTS.some(r => r.id === activeRestaurant.id);
      
      const versionOptions = [];
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
          
          // Versioning props
          availableVersions: versionOptions,
          currentVersionId: activeMenuVersionId || '',
          onVersionChange: (id: string) => setActiveMenuVersionId(id),
          onScrapeNew: () => setActiveMenuVersionId('NEW')
      };

      let BuilderContent;
      
      if (showImporter) {
          BuilderContent = <MenuImporter 
              restaurant={activeRestaurant} 
              onImport={handleMenuImport}
              onCancel={versionOptions.length > 0 ? () => setActiveMenuVersionId(versionOptions[0].id) : undefined}
          />;
      } else {
          // If we have specific component for system data AND we are in system mode
          const isSystemMode = activeMenuVersionId === 'SYSTEM';
          
          // We can just use BowlBuilder for everything unless specific layout is needed.
          // For now, to support dynamic switching, we will use BowlBuilder primarily.
          // If strict specialized components are needed (like Cava having special logic), we would check ID.
          // But since the request is about scraped data, generic BowlBuilder is best.
          
          if (isSystemMode && activeRestaurant.id === 'cava') {
               BuilderContent = <Cava {...restaurantProps} />;
          } else if (isSystemMode && activeRestaurant.id === 'chipotle') {
               BuilderContent = <Chipotle {...restaurantProps} />;
          } else if (isSystemMode && activeRestaurant.id === 'sweetgreen') {
               BuilderContent = <Sweetgreen {...restaurantProps} />;
          } else if (isSystemMode && activeRestaurant.id === 'jerseymikes') {
               BuilderContent = <JerseyMikes {...restaurantProps} />;
          } else if (isSystemMode && activeRestaurant.id === 'josetejas') {
               BuilderContent = <JoseTejas {...restaurantProps} />;
          } else if (isSystemMode && activeRestaurant.id === 'shakeshack') {
               BuilderContent = <ShakeShack {...restaurantProps} />;
          } else if (isSystemMode && activeRestaurant.id === 'franklin') {
               BuilderContent = <FranklinSteakhouse {...restaurantProps} />;
          } else if (isSystemMode && activeRestaurant.id === 'calandras') {
               BuilderContent = <Calandras {...restaurantProps} />;
          } else {
               // Default Builder (Handles Scraped Data & Generic Restaurants)
               BuilderContent = <BowlBuilder 
                    menu={currentMenu} 
                    presets={currentPresets} 
                    restaurantColor={activeRestaurant.color} 
                    {...restaurantProps} 
               />;
          }
      }

      const isFav = favoriteIds.has(activeRestaurant.id);

      return (
        <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
            <header className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button 
                            onClick={() => { setActiveRestaurantId(null); setViewMode('HOME'); }}
                            className="p-1.5 md:p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
                            title="Return to Hub"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-xl md:text-2xl">{activeRestaurant.logo}</span>
                            <h1 className="text-lg md:text-xl font-bold tracking-tight text-stone-800 line-clamp-1">
                                {activeRestaurant.name}
                            </h1>
                            <button 
                                onClick={() => toggleFavorite(activeRestaurant.id)}
                                className={`p-1.5 rounded-full transition-colors ${isFav ? 'bg-amber-100 text-amber-500 hover:bg-amber-200' : 'bg-stone-100 text-stone-400 hover:text-stone-600 hover:bg-stone-200'}`}
                            >
                                <Star className={`w-3 h-3 md:w-4 md:h-4 ${isFav ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         <button 
                            onClick={() => setViewMode('SAVES')}
                            className="text-stone-500 hover:text-stone-900 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium"
                        >
                            <History className="w-3.5 h-3.5 md:w-4 md:h-4" /> Saves
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-2 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                <div className="md:col-span-8 lg:col-span-9 h-[calc(100vh-6rem)]">
                    {BuilderContent}
                </div>
                <div className="md:col-span-4 lg:col-span-3 space-y-4">
                    {!showImporter && (
                        <>
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
                                        {Array.from(new Set(currentMenu.filter((i: Ingredient) => selectedIds.includes(i.id)).map((i: Ingredient) => i.category))).map(cat => (
                                            <div key={String(cat)} className="border-b border-stone-100 last:border-0 pb-2">
                                                <h4 className="text-[10px] md:text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">{cat}</h4>
                                                <ul className="space-y-1">
                                                    {currentMenu.filter((i: Ingredient) => i.category === cat && selectedIds.includes(i.id)).map((item: Ingredient) => (
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
                        <GeminiAssistant 
                            onApplySuggestion={handleApplyAISuggestion}
                            menu={currentMenu}
                            restaurantName={activeRestaurant.name}
                        />
                        </>
                    )}
                </div>
            </main>
        </div>
      );
  }

  // 3. Home / Landing Page
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
            <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-3 md:px-4 h-16 md:h-20 flex items-center justify-between">
                <div>
                    <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white font-mono">HICKORY TERRACE</h1>
                    <p className="text-stone-400 text-[10px] md:text-xs tracking-widest uppercase">Food Ordering System 3000</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <button 
                        onClick={() => setViewMode('SAVES')}
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

        <main className="max-w-6xl mx-auto p-3 md:p-8 space-y-8 md:space-y-12">
            
            {/* Favorites Section */}
            <section>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-2 text-stone-500">
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                        <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider">Favorites</h2>
                    </div>
                    <button 
                        onClick={handleRandomPick}
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

                        return (
                            <button 
                                key={r.id}
                                onClick={() => {
                                    if (!isRandomizing) {
                                        handleRestaurantSelect(r.id);
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
                                <div>
                                    <span className="text-2xl md:text-3xl mb-1 md:mb-2 block group-hover:scale-110 transition-transform duration-300">{r.logo}</span>
                                    <h3 className="text-base md:text-lg font-bold text-stone-800 group-hover:text-stone-900">{r.name}</h3>
                                </div>
                                <span className="text-[10px] font-mono text-stone-400 uppercase">Verified Menu</span>
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
                    {exploreList.map(r => (
                        <button 
                            key={r.id}
                            onClick={() => {
                                if (isRandomizing) return;
                                handleRestaurantSelect(r.id);
                            }}
                            className="bg-white rounded-lg p-2 md:p-3 border border-stone-200 hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center gap-2 md:gap-3"
                        >
                            <span className="text-lg md:text-xl bg-stone-100 p-1 rounded">{r.logo}</span>
                            <span className="text-xs md:text-sm font-medium text-stone-700 truncate">{r.name}</span>
                        </button>
                    ))}
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
                        onClick={() => setViewMode('SAVES')}
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
                                    onClick={() => handleLoadOrder(order)}
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
        </main>
    </div>
  );
};

export default App;
