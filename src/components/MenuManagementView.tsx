import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Clock, 
  Camera,
  QrCode,
  Download,
  Printer,
  TrendingUp,
  Info,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { MenuItem, MenuCategory, InventoryItem } from '../types';

interface MenuManagementViewProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteMenuItem: (id: string) => void;
  themeStyle: 'gold' | 'platinum';
  inventory: InventoryItem[];
}

export default function MenuManagementView({
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  themeStyle,
  inventory
}: MenuManagementViewProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal controllers
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeQrItem, setActiveQrItem] = useState<MenuItem | null>(null);

  // Table Menu QR Code States
  const [showTableQrModal, setShowTableQrModal] = useState(false);
  const [selectedTableForQr, setSelectedTableForQr] = useState('1');

  // AI Pricing Modal states
  const [showAiPricingModal, setShowAiPricingModal] = useState(false);
  const [aiPricingItem, setAiPricingItem] = useState<MenuItem | null>(null);
  const [profitMargin, setProfitMargin] = useState(70);
  const [selectedIngredients, setSelectedIngredients] = useState<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    unitCost: number;
  }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    suggestedPrice: number;
    totalCostOfIngredients: number;
    calculatedMargin: number;
    ingredientsUsed: {
      name: string;
      quantityNeeded: number;
      unit: string;
      costContribution: number;
      isFromInventory: boolean;
    }[];
    reasoning: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Form input fields states
  const [name, setName] = useState('');
  const [price, setPrice] = useState(15.00);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MenuCategory>('Main Course');
  const [image, setImage] = useState('');
  const [available, setAvailable] = useState(true);
  const [preparationTime, setPreparationTime] = useState(15);

  const categoriesList: (MenuCategory | 'All')[] = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks', 'Specials'];

  // Handle opening of creation modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setName('');
    setPrice(15.00);
    setDescription('');
    setCategory('Main Course');
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80');
    setAvailable(true);
    setPreparationTime(15);
    setShowFormModal(true);
  };

  // Handle opening of editing modal
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price);
    setDescription(item.description);
    setCategory(item.category);
    setImage(item.image);
    setAvailable(item.available);
    setPreparationTime(item.preparationTime);
    setShowFormModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || !image) {
      alert('Please fill out all food item details.');
      return;
    }

    if (editingItem) {
      // Edit existing
      onUpdateMenuItem(editingItem.id, {
        name,
        price,
        description,
        category,
        image,
        available,
        preparationTime
      });
    } else {
      // Create new
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const newItem: MenuItem = {
        id: `m_${Date.now()}_${randomSuffix}`,
        name,
        price,
        description,
        category,
        image,
        available,
        preparationTime
      };
      onAddMenuItem(newItem);
    }
    
    setShowFormModal(false);
  };

  // AI Pricing Handler Functions
  const handleOpenAiPricing = (item: MenuItem) => {
    setAiPricingItem(item);
    setProfitMargin(70);
    setAiResult(null);
    setAiError(null);
    setAiLoading(false);

    // Filter active inventory list to suggest likely matches
    const suggested: { id: string; name: string; quantity: number; unit: string; unitCost: number }[] = [];
    if (inventory) {
      inventory.forEach(inv => {
        const invNameLower = inv.name.toLowerCase();
        const itemNameLower = item.name.toLowerCase();
        const itemDescLower = item.description.toLowerCase();
        
        // Match name or description keywords or categories
        if (
          itemNameLower.includes(invNameLower) || 
          itemDescLower.includes(invNameLower) ||
          invNameLower.includes(itemNameLower.split(' ')[0]) ||
          (invNameLower.includes('beef') && itemNameLower.includes('wagyu')) ||
          (invNameLower.includes('salmon') && itemNameLower.includes('salmon')) ||
          (invNameLower.includes('lobster') && itemNameLower.includes('lobster')) ||
          (invNameLower.includes('truffle') && itemNameLower.includes('truffle')) ||
          (invNameLower.includes('mint') && itemNameLower.includes('mint'))
        ) {
          let portion = 0.15; // default 150g or similar
          if (inv.unit === 'units') portion = 1;
          if (inv.unit === 'liters') portion = 0.05; // 50ml
          
          suggested.push({
            id: inv.id,
            name: inv.name,
            quantity: portion,
            unit: inv.unit,
            unitCost: inv.unitCost || 10.00
          });
        }
      });
    }

    setSelectedIngredients(suggested);
    setShowAiPricingModal(true);
  };

  const handleCalculateAiPrice = async () => {
    if (!aiPricingItem) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/ai/auto-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuItemName: aiPricingItem.name,
          description: aiPricingItem.description,
          category: aiPricingItem.category,
          selectedIngredients: selectedIngredients,
          profitMargin: profitMargin,
          availableInventory: inventory
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate recommendation');
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'An error occurred during calculation');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyRecommendedPrice = () => {
    if (!aiPricingItem || !aiResult) return;
    onUpdateMenuItem(aiPricingItem.id, { price: aiResult.suggestedPrice });
    setShowAiPricingModal(false);
    setAiPricingItem(null);
    setAiResult(null);
  };

  const handleAddIngredientToPricing = (id: string) => {
    const matched = inventory.find(i => i.id === id);
    if (!matched) return;
    if (selectedIngredients.some(i => i.id === id)) return; // already added
    
    let portion = 1;
    if (matched.unit === 'kg') portion = 0.1;
    if (matched.unit === 'liters') portion = 0.05;
    
    setSelectedIngredients([
      ...selectedIngredients,
      {
        id: matched.id,
        name: matched.name,
        quantity: portion,
        unit: matched.unit,
        unitCost: matched.unitCost || 10.00
      }
    ]);
  };

  const handleRemoveIngredientFromPricing = (id: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.id !== id));
  };

  const handleUpdateIngredientQuantity = (id: string, qty: number) => {
    setSelectedIngredients(selectedIngredients.map(i => 
      i.id === id ? { ...i, quantity: Math.max(0, qty) } : i
    ));
  };

  // Filtering lists
  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* 1. Category Bar and Add Action button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4" id="menu-controls">
        {/* Left Side: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none w-4 h-4 my-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gastronomy database..."
              className="w-full bg-[#121215] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs text-white"
            />
          </div>

          {/* Categories Horizontal filters */}
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500/15 border border-gold-500/25 text-gold-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Panel */}
        <div className="flex gap-2 w-full md:w-auto items-center justify-end shrink-0">
          {/* Table Menu QR Generator */}
          <button
            onClick={() => setShowTableQrModal(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/5 border border-white/10 text-gold-500 hover:text-white hover:bg-white/10 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            title="Generate Shareable Menu Link & QR Code for Tables"
          >
            <QrCode className="w-4.5 h-4.5 text-gold-500" />
            <span>Table QR Generator</span>
          </button>

          {/* Create Food item Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Gastronomy Plate</span>
          </button>
        </div>
      </div>

      {/* 2. Menu Items Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5" id="menu-cards-grid">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`menu-card-layout-${item.id}`}
            whileHover={{ y: -6 }}
            className={`glass-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 border relative text-left h-[340px] ${
              item.available ? 'border-white/5 hover:border-gold-500/20' : 'border-red-500/10 hover:border-red-500/20'
            }`}
          >
            {/* Food Image Banner */}
            <div className="relative h-44 w-full">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Overlay category badge */}
              <div className="absolute top-3 left-3 bg-[#0a0a0c]/80 backdrop-blur-sm border border-white/5 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-bold text-gray-300">
                {item.category}
              </div>

              {/* Price Tag Overlay */}
              <div className="absolute bottom-3 right-3 bg-gradient-to-r from-gold-500 to-amber-600 border border-gold-500/10 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-black shadow-lg">
                ${item.price.toFixed(2)}
              </div>

              {/* Sold Out Badge overlay */}
              {!item.available && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex flex-col items-center justify-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3.5 py-1 rounded-full">
                    Sold Out
                  </span>
                  <p className="text-[9px] text-gray-400">Restock required</p>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5 text-left">
                <h4 className="text-sm font-extrabold text-white leading-tight truncate">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Footer parameters & actions */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 mt-1 text-xs">
                {/* Available switches */}
                <button
                  type="button"
                  onClick={() => onUpdateMenuItem(item.id, { available: !item.available })}
                  className={`text-[9px] font-bold uppercase tracking-wider font-mono border px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    item.available 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                  }`}
                >
                  {item.available ? '● Active' : '✕ Dormant'}
                </button>

                {/* Preparation Time indicator */}
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                  <Clock className="w-3.5 h-3.5 text-gold-500/70" />
                  <span>{item.preparationTime}m</span>
                </div>

                {/* Edit, QR Code, & Delete CTA controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setActiveQrItem(item);
                      setShowQrModal(true);
                    }}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-gray-300 hover:text-white transition-all cursor-pointer"
                    title="Generate QR Code"
                  >
                    <QrCode className="w-3 h-3 text-gold-500" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/5 text-gray-300 hover:text-white transition-all cursor-pointer"
                    title="Edit Plate details"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to retire ${item.name} from the catalog?`)) {
                        onDeleteMenuItem(item.id);
                      }
                    }}
                    className="p-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 transition-all cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Form Modal (Create and Edit Items) */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-card p-6 rounded-2xl relative text-left glow-gold max-h-[90vh] overflow-y-auto"
              id="menu-form-modal"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {editingItem ? 'Edit Culinary Dish' : 'Add New Culinary Masterpiece'}
                  </h3>
                  <p className="text-xs text-gray-400">Configure catalog information and visual assets</p>
                </div>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Dish Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Dish Title</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white"
                      placeholder="e.g. Herb Butter Escargot"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Menu Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.5"
                      required
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value))}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white font-mono"
                      placeholder="28.00"
                    />
                  </div>

                  {/* Category select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Section Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MenuCategory)}
                      className="w-full bg-[#0e0e11] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3 text-sm text-white cursor-pointer"
                    >
                      {(['Starters', 'Main Course', 'Desserts', 'Drinks', 'Specials'] as MenuCategory[]).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preparation Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Prep Timing (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(parseInt(e.target.value))}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white font-mono"
                      placeholder="15"
                    />
                  </div>

                  {/* Available state */}
                  <div className="space-y-1.5 flex flex-col justify-end pb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <span>Inventory Availability</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-gray-300 hover:text-white transition-colors bg-[#0e0e11] border border-white/5 py-2 px-3.5 rounded-xl">
                      <input
                        type="checkbox"
                        checked={available}
                        onChange={(e) => setAvailable(e.target.checked)}
                        className="rounded border-white/10 bg-white/5 text-amber-500 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                      />
                      <span className="text-xs font-medium">{available ? 'Plentiful Stock (Active)' : 'Retired / Sold Out'}</span>
                    </label>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Image Asset URL</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
                        <Camera className="w-4 h-4" />
                      </span>
                      <input
                        type="url"
                        required
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-white"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Culinary Description</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="e.g. Crisp organic arugula layered with toasted hazelnuts, local goats cheese, and cold-pressed citrus vinegars..."
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2 px-3 text-xs text-gray-300 placeholder-gray-600 resize-none"
                    />
                  </div>
                </div>

                {/* Submit panel */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-gold-500/10 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingItem ? 'Update Plate' : 'Publish Culinary Dish'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showQrModal && activeQrItem && (
          <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl relative text-left glow-gold max-h-[90vh] overflow-y-auto"
              id="menu-qr-modal"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Gastronomy QR Code
                  </h3>
                  <p className="text-xs text-gray-400">Scan code to view plate presentation and details</p>
                </div>
                <button
                  onClick={() => {
                    setShowQrModal(false);
                    setActiveQrItem(null);
                  }}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center space-y-5 text-center">
                {/* Visual Preview */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 shadow-md">
                  <img
                    src={activeQrItem.image}
                    alt={activeQrItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 text-[10px] font-bold text-gold-500 font-mono">
                    ${activeQrItem.price.toFixed(2)}
                  </div>
                </div>

                {/* Dish details */}
                <div>
                  <h4 className="text-base font-extrabold text-white leading-tight">
                    {activeQrItem.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-mono font-bold">
                    {activeQrItem.category} • {activeQrItem.preparationTime} min prep
                  </p>
                </div>

                {/* QR Code Container with white background for maximum contrast & quick scanning */}
                <div className="bg-white p-5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                      `🍽️ DELIFLOW GASTRONOMY 🍽️\n` +
                      `Dish: ${activeQrItem.name}\n` +
                      `Category: ${activeQrItem.category}\n` +
                      `Price: $${activeQrItem.price.toFixed(2)}\n` +
                      `Preparation Time: ${activeQrItem.preparationTime} minutes\n` +
                      `Description: ${activeQrItem.description}\n` +
                      `Status: ${activeQrItem.available ? 'Plentiful Stock (Active)' : 'Sold Out / Retired'}`
                    )}&color=121215&bgcolor=ffffff&margin=10`}
                    alt={`${activeQrItem.name} QR Code`}
                    className="w-48 h-48"
                  />
                </div>

                <p className="text-[10px] text-gray-500 max-w-xs leading-relaxed">
                  Any smartphone camera can scan this QR code to instantly display complete gastronomy specifications and dish composition.
                </p>

                {/* Action CTA panel */}
                <div className="flex gap-2.5 w-full pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!activeQrItem) return;
                      const qrText = `🍽️ DELIFLOW GASTRONOMY 🍽️\n` +
                        `Dish: ${activeQrItem.name}\n` +
                        `Category: ${activeQrItem.category}\n` +
                        `Price: $${activeQrItem.price.toFixed(2)}\n` +
                        `Preparation Time: ${activeQrItem.preparationTime} minutes\n` +
                        `Description: ${activeQrItem.description}\n` +
                        `Status: ${activeQrItem.available ? 'Plentiful Stock (Active)' : 'Sold Out / Retired'}`;
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrText)}&color=121215&bgcolor=ffffff&margin=15`;
                      
                      fetch(qrUrl)
                        .then(resp => resp.blob())
                        .then(blob => {
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${activeQrItem.name.toLowerCase().replace(/\s+/g, '_')}_qr.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        })
                        .catch(err => {
                          console.error('Failed to download QR code', err);
                          alert('Failed to download QR code. Please try again.');
                        });
                    }}
                    className="flex-1 py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center font-mono"
                  >
                    <Download className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!activeQrItem) return;
                      const qrText = `🍽️ DELIFLOW GASTRONOMY 🍽️\n` +
                        `Dish: ${activeQrItem.name}\n` +
                        `Category: ${activeQrItem.category}\n` +
                        `Price: $${activeQrItem.price.toFixed(2)}\n` +
                        `Preparation Time: ${activeQrItem.preparationTime} minutes\n` +
                        `Description: ${activeQrItem.description}\n` +
                        `Status: ${activeQrItem.available ? 'Plentiful Stock (Active)' : 'Sold Out / Retired'}`;
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrText)}&color=121215&bgcolor=ffffff&margin=15`;

                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Print QR - ${activeQrItem.name}</title>
                              <style>
                                body {
                                  font-family: system-ui, -apple-system, sans-serif;
                                  text-align: center;
                                  padding: 40px;
                                  color: #121215;
                                  background: #fff;
                                }
                                .card {
                                  border: 2px solid #eaeaea;
                                  border-radius: 16px;
                                  padding: 30px;
                                  max-width: 400px;
                                  margin: 0 auto;
                                  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                                }
                                h1 { font-size: 24px; margin-bottom: 5px; color: #b45309; }
                                h2 { font-size: 18px; margin: 10px 0; color: #1f2937; }
                                p { font-size: 14px; color: #4b5563; margin-bottom: 20px; line-height: 1.4; }
                                img { width: 250px; height: 250px; margin-bottom: 15px; }
                                .footer { font-size: 11px; color: #9ca3af; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
                              </style>
                            </head>
                            <body>
                              <div class="card">
                                <h1>DELIFLOW GASTRONOMY</h1>
                                <h2>${activeQrItem.name}</h2>
                                <p>${activeQrItem.category} • $${activeQrItem.price.toFixed(2)}<br/>${activeQrItem.description}</p>
                                <img src="${qrUrl}" alt="QR Code" />
                                <div class="footer">Scan with phone to view dish details</div>
                              </div>
                              <script>
                                window.onload = function() {
                                  window.print();
                                  setTimeout(function() { window.close(); }, 500);
                                };
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }}
                    className="flex-1 py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center font-mono"
                  >
                    <Printer className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>Print Card</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showTableQrModal && (
          <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl relative text-left glow-gold max-h-[90vh] overflow-y-auto"
              id="table-menu-qr-modal"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-gold-500" />
                    <span>Table Menu QR Generator</span>
                  </h3>
                  <p className="text-xs text-gray-400">Generate public menus with table query routing</p>
                </div>
                <button
                  onClick={() => {
                    setShowTableQrModal(false);
                  }}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 block">Table Assignment</label>
                  <select
                    value={selectedTableForQr}
                    onChange={(e) => setSelectedTableForQr(e.target.value)}
                    className="w-full bg-[#121215] border border-white/10 focus:border-gold-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="">General Menu (No Table Number)</option>
                    {Array.from({ length: 15 }, (_, i) => (
                      <option key={i + 1} value={`${i + 1}`}>
                        Table {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generated Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 block">Digital Menu Live Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}${window.location.pathname}?view=public-menu${selectedTableForQr ? `&table=${selectedTableForQr}` : ''}`}
                      className="flex-1 bg-[#121215] border border-white/5 rounded-xl px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}?view=public-menu${selectedTableForQr ? `&table=${selectedTableForQr}` : ''}`;
                        navigator.clipboard.writeText(url);
                        alert('Link copied to clipboard! You can share or email this to anyone.');
                      }}
                      className="px-3 py-2 bg-gold-500/10 border border-gold-500/20 text-gold-500 hover:bg-gold-500/20 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Rendered QR Code */}
                <div className="flex flex-col items-center py-2 space-y-3">
                  <div className="bg-white p-4.5 rounded-2xl shadow-xl flex items-center justify-center border border-white/5">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                        `${window.location.origin}${window.location.pathname}?view=public-menu${selectedTableForQr ? `&table=${selectedTableForQr}` : ''}`
                      )}&color=121215&bgcolor=ffffff&margin=12`}
                      alt={`Table ${selectedTableForQr || 'General'} Menu QR Code`}
                      className="w-44 h-44"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium text-center max-w-xs">
                    Scan with smartphone camera to instantly view the public digital menu on a browser.
                  </span>
                </div>

                {/* Actions Panel */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      const finalUrl = `${window.location.origin}${window.location.pathname}?view=public-menu${selectedTableForQr ? `&table=${selectedTableForQr}` : ''}`;
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(finalUrl)}&color=121215&bgcolor=ffffff&margin=15`;
                      
                      fetch(qrUrl)
                        .then(resp => resp.blob())
                        .then(blob => {
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `table_${selectedTableForQr || 'general'}_menu_qr.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          window.URL.revokeObjectURL(url);
                        })
                        .catch(err => {
                          console.error(err);
                          alert('Failed to download QR code. Please try again.');
                        });
                    }}
                    className="py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center font-mono"
                  >
                    <Download className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>Download QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const finalUrl = `${window.location.origin}${window.location.pathname}?view=public-menu${selectedTableForQr ? `&table=${selectedTableForQr}` : ''}`;
                      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(finalUrl)}&color=121215&bgcolor=ffffff&margin=15`;

                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Print Menu QR - Table ${selectedTableForQr || 'General'}</title>
                              <style>
                                body {
                                  font-family: system-ui, -apple-system, sans-serif;
                                  text-align: center;
                                  padding: 40px;
                                  color: #121215;
                                  background: #fff;
                                }
                                .card {
                                  border: 3px solid #eaeaea;
                                  border-radius: 20px;
                                  padding: 35px;
                                  max-width: 420px;
                                  margin: 0 auto;
                                  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
                                }
                                h1 { font-size: 24px; margin-bottom: 5px; color: #b45309; letter-spacing: 0.5px; }
                                h2 { font-size: 16px; margin: 10px 0; color: #4b5563; font-weight: normal; }
                                .table-label { font-size: 28px; font-weight: 800; color: #111827; margin: 15px 0; }
                                p { font-size: 13px; color: #6b7280; margin-bottom: 25px; line-height: 1.5; }
                                img { width: 220px; height: 220px; margin-bottom: 15px; }
                                .footer { font-size: 11px; color: #9ca3af; margin-top: 20px; font-weight: bold; letter-spacing: 1px; }
                              </style>
                            </head>
                            <body>
                              <div class="card">
                                <h1>DIGITAL GUEST MENU</h1>
                                <h2>Scan to explore current dishes and make service requests</h2>
                                ${selectedTableForQr ? `<div class="table-label">TABLE ${selectedTableForQr}</div>` : '<div class="table-label">WELCOME MENU</div>'}
                                <img src="${qrUrl}" alt="QR Code" />
                                <p>Scan this table sign using any mobile smartphone to browse culinary plates, filter allergens, and notify service crew instantly.</p>
                                <div class="footer">BISTRO GUEST EXPERIENCE SUITE</div>
                              </div>
                              <script>
                                window.onload = function() {
                                  window.print();
                                  setTimeout(function() { window.close(); }, 500);
                                };
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }}
                    className="py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center font-mono"
                  >
                    <Printer className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>Print Sign</span>
                  </button>
                </div>

                {/* Instant In-App Preview */}
                <button
                  type="button"
                  onClick={() => {
                    const finalUrl = `${window.location.origin}${window.location.pathname}?view=public-menu${selectedTableForQr ? `&table=${selectedTableForQr}` : ''}`;
                    setShowTableQrModal(false);
                    // Push state and trigger state update
                    window.history.pushState({}, '', finalUrl);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Guest Live Preview</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
