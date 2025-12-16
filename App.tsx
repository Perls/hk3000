
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SavesMenu } from './components/SavesMenu';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { BuilderLayout } from './components/BuilderLayout';
import { Order, AIOrderSuggestion, Preset, Ingredient, SavedMenu, Restaurant } from './types';
import { RESTAURANTS } from './constants';
import { FAIRFIELD_RESTAURANTS } from './data/fairfield';

const App: React.FC = () => {
  // Navigation State
  const [viewMode, setViewMode] = useState<'HOME' | 'BUILDER' | 'SAVES'>('HOME');
  
  // Data State
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [savedOrders, setSavedOrders] = useState<Order[]>([]);
  const [customRestaurants, setCustomRestaurants] = useState<Restaurant[]>([]);
  
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
    // Start with all hardcoded restaurants
    const defaults = new Set(RESTAURANTS.map(r => r.id));
    // Add specific closest Fairfield locations
    defaults.add('ff-manhattan');
    defaults.add('ff-johnny');
    defaults.add('ff-popeyes');
    return defaults;
  });

  // Random Pick State
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Load Saved Data
  useEffect(() => {
    const saved = localStorage.getItem('hickory_saved_orders');
    if (saved) {
      try { setSavedOrders(JSON.parse(saved)); } catch (e) { console.error("Failed to load orders"); }
    }
    
    const savedMenusRaw = localStorage.getItem('hickory_saved_menus');
    if (savedMenusRaw) {
        try { setSavedMenus(JSON.parse(savedMenusRaw)); } catch (e) { console.error("Failed to load menus"); }
    }

    const savedCustomRest = localStorage.getItem('hickory_custom_restaurants');
    if (savedCustomRest) {
        try { setCustomRestaurants(JSON.parse(savedCustomRest)); } catch (e) { console.error("Failed to load custom restaurants"); }
    }
  }, []);

  const saveToStorage = (orders: Order[]) => {
    localStorage.setItem('hickory_saved_orders', JSON.stringify(orders));
  };

  const saveMenusToStorage = (menus: Record<string, SavedMenu[]>) => {
      localStorage.setItem('hickory_saved_menus', JSON.stringify(menus));
  };

  const saveCustomRestaurants = (rests: Restaurant[]) => {
      localStorage.setItem('hickory_custom_restaurants', JSON.stringify(rests));
  }

  // Helpers
  const allRestaurants = useMemo(() => [
      ...RESTAURANTS, 
      ...FAIRFIELD_RESTAURANTS,
      ...customRestaurants
  ], [customRestaurants]);
  
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

  const handleAddRestaurant = (r: Restaurant) => {
      const updated = [...customRestaurants, r];
      setCustomRestaurants(updated);
      saveCustomRestaurants(updated);
      
      // Auto favorite new additions so they show up easily
      toggleFavorite(r.id);
  };

  // Sound Effects Generator (Kept in App for global usage)
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

  const handleRandomPick = () => {
    if (isRandomizing) return;
    if (favoritesList.length < 2) {
        alert("Add more favorites to play Random Pick!");
        return;
    }
    setIsRandomizing(true);
    let spins = 0;
    const maxSpins = 25; 
    let currentInterval = 50; 
    const pool = favoritesList.map(r => r.id);

    const spin = () => {
        const randomIndex = Math.floor(Math.random() * pool.length);
        const randomId = pool[randomIndex];
        setHighlightedId(randomId);
        playSound('tick');
        spins++;
        if (spins < maxSpins) {
            currentInterval = currentInterval * 1.1; 
            setTimeout(spin, currentInterval);
        } else {
            playSound('win');
            setTimeout(() => {
                setIsRandomizing(false);
                setHighlightedId(null); 
                handleRestaurantSelect(randomId);
            }, 1500);
        }
    };
    spin();
  };

  const handleRestaurantSelect = (id: string) => {
      setActiveRestaurantId(id);
      setSelectedIds([]);
      setCustomItems([]);
      
      const existing = savedMenus[id];
      const rest = allRestaurants.find(r => r.id === id);
      const isSystem = RESTAURANTS.some(r => r.id === id);

      if (existing && existing.length > 0) {
          setActiveMenuVersionId(existing[0].id);
          setActiveCategory(existing[0].presets.length > 0 ? 'PRESETS' : 'ALL');
      } else if (isSystem) {
          setActiveMenuVersionId('SYSTEM');
          setActiveCategory(rest?.presets && rest.presets.length > 0 ? 'PRESETS' : 'ALL');
      } else {
          setActiveMenuVersionId('NEW'); 
      }
      
      setViewMode('BUILDER');
  };

  const toggleIngredient = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleSelectPreset = (preset: Preset) => {
      setSelectedIds(preset.itemIds);
      setCustomItems([]); 
      setActiveCategory('ALL'); 
  };
  
  const handleAddCustomItem = (item: string) => setCustomItems(prev => [...prev, item]);
  const handleRemoveCustomItem = (index: number) => setCustomItems(prev => prev.filter((_, i) => i !== index));

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

  const handleCancelSave = () => activeRestaurantId ? setViewMode('BUILDER') : setPendingSaveOrder(null);

  const handleDeleteOrder = (id: string) => {
    const updated = savedOrders.filter(o => o.id !== id);
    setSavedOrders(updated);
    saveToStorage(updated);
  };

  const handleLoadOrder = (order: Order) => {
    handleRestaurantSelect(order.restaurantId);
    setSelectedIds(order.items);
    setCustomItems(order.customItems || []);
    setActiveCategory('ALL');
  };

  const handleApplyAISuggestion = (suggestion: AIOrderSuggestion) => {
    setSelectedIds(suggestion.itemIds);
    setCustomItems([]); 
    alert(`System Logic: ${suggestion.reasoning}`);
  };

  const handleMenuImport = (
      menu: Ingredient[], 
      presets: Preset[], 
      info?: { phoneNumber?: string, rating?: number, deliveryApps?: string[] }
  ) => {
      if (!activeRestaurantId) return;

      // 1. Save the menu version
      const newMenu: SavedMenu = {
          id: crypto.randomUUID(),
          restaurantId: activeRestaurantId,
          timestamp: Date.now(),
          menu,
          presets,
          sourceUrl: ''
      };
      const updatedMenus = { ...savedMenus, [activeRestaurantId]: [newMenu, ...(savedMenus[activeRestaurantId] || [])] };
      setSavedMenus(updatedMenus);
      saveMenusToStorage(updatedMenus);

      // 2. If valid info was scraped, update the Custom Restaurant entry if it exists
      if (info) {
          const customIndex = customRestaurants.findIndex(r => r.id === activeRestaurantId);
          if (customIndex !== -1) {
              const updatedRests = [...customRestaurants];
              updatedRests[customIndex] = {
                  ...updatedRests[customIndex],
                  phoneNumber: info.phoneNumber,
                  rating: info.rating,
                  deliveryApps: info.deliveryApps
              };
              setCustomRestaurants(updatedRests);
              saveCustomRestaurants(updatedRests);
          }
      }

      setActiveMenuVersionId(newMenu.id);
      setActiveCategory('ALL');
  };

  const getActiveMenuData = () => {
      if (!activeRestaurantId) return { menu: [], presets: [] };
      if (activeMenuVersionId && activeMenuVersionId !== 'SYSTEM' && activeMenuVersionId !== 'NEW') {
          const menus = savedMenus[activeRestaurantId];
          const found = menus?.find(m => m.id === activeMenuVersionId);
          if (found) return { menu: found.menu, presets: found.presets };
      }
      const systemRest = RESTAURANTS.find(r => r.id === activeRestaurantId);
      if (systemRest) return { menu: systemRest.menu, presets: systemRest.presets || [] };
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

  // --- Render ---

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

  if (viewMode === 'BUILDER' && activeRestaurant) {
      const { menu, presets } = getActiveMenuData();
      return (
          <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
              <Header 
                  viewMode='BUILDER'
                  onHome={() => { setActiveRestaurantId(null); setViewMode('HOME'); }}
                  onSaves={() => setViewMode('SAVES')}
                  userName={userName}
                  setUserName={setUserName}
                  activeRestaurant={{ name: activeRestaurant.name, logo: activeRestaurant.logo, id: activeRestaurant.id }}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favoriteIds.has(activeRestaurant.id)}
              />
              <BuilderLayout 
                  activeRestaurant={activeRestaurant}
                  selectedIds={selectedIds}
                  customItems={customItems}
                  menu={menu}
                  presets={presets}
                  savedMenus={savedMenus}
                  activeMenuVersionId={activeMenuVersionId}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  setActiveMenuVersionId={setActiveMenuVersionId}
                  toggleIngredient={toggleIngredient}
                  handleSelectPreset={handleSelectPreset}
                  handleAddCustomItem={handleAddCustomItem}
                  handleRemoveCustomItem={handleRemoveCustomItem}
                  handleSaveOrder={handleSaveOrder}
                  handleMenuImport={handleMenuImport}
                  handleApplyAISuggestion={handleApplyAISuggestion}
                  calculateTotalCalories={calculateTotalCalories}
                  setSelectedIds={setSelectedIds}
                  setCustomItems={setCustomItems}
                  hasSystem={RESTAURANTS.some(r => r.id === activeRestaurant.id)}
              />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
        <Header 
            viewMode='HOME'
            onHome={() => {}}
            onSaves={() => setViewMode('SAVES')}
            userName={userName}
            setUserName={setUserName}
        />
        <HomeView 
            favoritesList={favoritesList}
            exploreList={exploreList}
            savedOrders={savedOrders}
            allRestaurants={allRestaurants}
            highlightedId={highlightedId}
            isRandomizing={isRandomizing}
            onRandomPick={handleRandomPick}
            onSelectRestaurant={handleRestaurantSelect}
            onLoadOrder={handleLoadOrder}
            onViewSaves={() => setViewMode('SAVES')}
            onAddRestaurant={handleAddRestaurant}
        />
    </div>
  );
};

export default App;
