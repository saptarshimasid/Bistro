import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Utensils, 
  Clock, 
  Flame, 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  Volume2, 
  Info,
  Heart,
  ChevronRight,
  LogOut,
  Coffee,
  Sparkles,
  X
} from 'lucide-react';
import { MenuItem, MenuCategory, SystemSettings } from '../types';

interface PublicMenuViewProps {
  menuItems: MenuItem[];
  settings: SystemSettings;
  themeStyle: 'gold' | 'platinum';
  onExitPreview?: () => void;
}

export default function PublicMenuView({
  menuItems,
  settings,
  themeStyle,
  onExitPreview
}: PublicMenuViewProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'assistance'>('menu');

  // Parse Table Number from URL
  const queryParams = new URLSearchParams(window.location.search);
  const tableNum = queryParams.get('table') || '';

  const categoriesList: (MenuCategory | 'All')[] = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks', 'Specials'];

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => {
      setWaiterCalled(false);
    }, 8000);
  };

  const isGold = themeStyle === 'gold';
  const brandGradient = isGold 
    ? 'from-gold-500 to-amber-600' 
    : 'from-cyan-400 to-blue-600';
  const textBrandColor = isGold ? 'text-gold-500' : 'text-cyan-400';
  const bgBrandMuted = isGold ? 'bg-amber-500/10 border-gold-500/20 text-gold-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400';
  const buttonBrandColor = isGold 
    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-black hover:opacity-90' 
    : 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black hover:opacity-90';

  return (
    <div className={`min-h-screen flex flex-col bg-[#050508] text-white selection:bg-gold-500 selection:text-black font-sans`}>
      {/* Animated Glowing Mesh Backgrounds */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        {isGold ? (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/15 rounded-full blur-[140px]" />
          </>
        ) : (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[140px]" />
          </>
        )}
      </div>

      {/* Top Banner & Hospitality Header */}
      <header className="sticky top-0 z-30 bg-[#07070a]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 relative">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-br ${brandGradient} rounded-xl text-black`}>
              <Utensils className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h1 className="font-display font-extrabold text-base tracking-tight text-white leading-tight uppercase">
                {settings.restaurantName || 'Bistro'}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-[10px] font-mono font-semibold text-gray-400">Live Kitchen Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {tableNum && (
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-right font-mono shrink-0">
                <span className="text-[9px] text-gray-500 block uppercase leading-none">Your Seat</span>
                <span className={`text-xs font-bold ${textBrandColor} leading-none`}>Table {tableNum}</span>
              </div>
            )}
            {onExitPreview && (
              <button
                onClick={onExitPreview}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Exit Customer Menu Preview"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 relative z-10 space-y-6">
        
        {/* Navigation Tabs (Menu View vs Call Waiter) */}
        <div className="flex border-b border-white/5 p-1 bg-white/[0.02] rounded-xl max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu' 
                ? `${isGold ? 'bg-amber-500/20 text-gold-500 border border-gold-500/20' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/20'}`
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Digital Menu
          </button>
          <button
            onClick={() => setActiveTab('assistance')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'assistance'
                ? `${isGold ? 'bg-amber-500/20 text-gold-500 border border-gold-500/20' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/20'}`
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Table Assistance
          </button>
        </div>

        {activeTab === 'menu' ? (
          <>
            {/* Greeting Card with Welcome Message */}
            <div className="bg-gradient-to-br from-white/[0.015] to-transparent border border-white/5 p-5 rounded-2xl text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.01] rounded-full blur-xl" />
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl ${bgBrandMuted} shrink-0 mt-0.5`}>
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-white">Welcome to {settings.restaurantName || 'Bistro'}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Explore our exquisite gastronomy menu curated with gourmet ingredients. Simply scan individual plates to see details or tap to add favorites. Our service staff are ready to attend to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Category selection and Search filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none w-4 h-4 my-auto" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes or ingredients..."
                  className="w-full bg-[#121215] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs text-white"
                />
              </div>

              {/* Category buttons list */}
              <div className="flex gap-1 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                      activeCategory === cat
                        ? `${isGold ? 'bg-amber-500/15 border border-gold-500/25 text-gold-500' : 'bg-cyan-500/15 border border-cyan-400/25 text-cyan-400'}`
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" id="public-menu-grid">
              {filteredItems.map((item) => {
                const isFavorite = favorites.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layoutId={`public-menu-${item.id}`}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedItem(item)}
                    className={`glass-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 border relative text-left h-[330px] cursor-pointer ${
                      item.available ? 'border-white/5 hover:border-gold-500/10' : 'border-red-500/10'
                    }`}
                  >
                    {/* Dish image banner */}
                    <div className="relative h-40 w-full bg-neutral-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3 bg-[#0a0a0c]/80 backdrop-blur-sm border border-white/5 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-bold text-gray-300">
                        {item.category}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 rounded-full border border-white/5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-red-500 fill-red-500' : ''}`} />
                      </button>

                      {/* Price Tag overlay */}
                      <div className={`absolute bottom-3 right-3 bg-gradient-to-r ${brandGradient} border border-white/10 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-black shadow-lg`}>
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Sold Out view */}
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex flex-col items-center justify-center">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                            Currently Unavailable
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description & Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 justify-between">
                          <h4 className="text-sm font-extrabold text-white leading-tight truncate flex-1">
                            {item.name}
                          </h4>
                          {item.category === 'Specials' && (
                            <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mt-2 pt-2 border-t border-white/[0.03]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-500" />
                          <span>{item.preparationTime} mins</span>
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${item.available ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {item.available ? '● Available' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500">
                  <p className="text-sm font-medium">No gastronomy dishes match your filters.</p>
                  <button 
                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} 
                    className="text-gold-500 hover:underline text-xs mt-2 font-semibold"
                  >
                    Clear Search Filters
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Assistance tab view */
          <div className="max-w-md mx-auto space-y-6 text-center py-6" id="public-assistance-panel">
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-5 text-center">
              <div className="w-16 h-16 bg-amber-500/10 border border-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-white">Need Table Assistance?</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Call the waiter, request physical cutlery, ask for the water jug, or request the bill directly from your phone.
                </p>
              </div>

              {waiterCalled ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2 justify-center font-mono">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Waiter Dispatched. Attending to Table {tableNum || '[Unspecified]'} shortly!</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleCallWaiter}
                    className={`w-full py-3 ${buttonBrandColor} rounded-xl text-xs font-bold transition-all cursor-pointer font-mono`}
                  >
                    🔔 Call Waiter to Table {tableNum || '[Click to set]'}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => alert('🍽️ Fork, spoon, and clean cutlery request sent to server.')}
                      className="py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all border border-white/5 cursor-pointer"
                    >
                      🍴 Extra Cutlery
                    </button>
                    <button
                      onClick={() => alert('💧 Request for fresh chilled water pitcher sent to server.')}
                      className="py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all border border-white/5 cursor-pointer"
                    >
                      🥛 Chilled Water Pitcher
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-gray-500 text-[10px] leading-relaxed">
              *Request transmissions are routed directly to the Bistro Waiter Service Dashboard to minimize waiting overhead.
            </div>
          </div>
        )}
      </main>

      {/* Dish Inspection Detail Modal Popover */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#08080a] border border-white/10 rounded-2xl relative overflow-hidden text-left"
            >
              {/* Image banner */}
              <div className="relative h-64 w-full">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full border border-white/10 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-mono font-semibold text-gray-300">
                  {selectedItem.category}
                </div>
              </div>

              {/* Details Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-lg text-white">
                      {selectedItem.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      Prep Time: {selectedItem.preparationTime} minutes
                    </p>
                  </div>
                  <div className={`text-xl font-mono font-black ${textBrandColor}`}>
                    ${selectedItem.price.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">Plate Presentation</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Dietary Specs placeholder to enrich view */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-center">
                    <span className="text-[8px] text-gray-500 block uppercase font-mono">Dietary Status</span>
                    <span className="text-[10px] font-bold text-gray-300 mt-0.5 block">Gluten-Free</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-center">
                    <span className="text-[8px] text-gray-500 block uppercase font-mono">Sensitivities</span>
                    <span className="text-[10px] font-bold text-amber-500 mt-0.5 block">Contains Nuts</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-center">
                    <span className="text-[8px] text-gray-500 block uppercase font-mono">Chef Rating</span>
                    <span className="text-[10px] font-bold text-gold-500 mt-0.5 block">★★★★★</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-3">
                  <button
                    onClick={() => {
                      toggleFavorite(selectedItem.id, {} as any);
                    }}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(selectedItem.id) ? 'text-red-500 fill-red-500' : ''}`} />
                    <span>{favorites.includes(selectedItem.id) ? 'Favorited' : 'Add to Favorites'}</span>
                  </button>
                  <button
                    onClick={() => {
                      alert(`🛒 ${selectedItem.name} added to your checkout interest list! Let your waiter know when they arrive.`);
                      setSelectedItem(null);
                    }}
                    className={`flex-1 py-2.5 ${buttonBrandColor} rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer`}
                  >
                    <span>Interest List</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simplified Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-[10px] text-gray-500 font-mono mt-auto relative z-10">
        <div>© {new Date().getFullYear()} {settings.restaurantName || 'Bistro'} • Designed with Hospitality Care</div>
        <div className="mt-1">Powered by Bistro Digital Guest Suite</div>
      </footer>
    </div>
  );
}
