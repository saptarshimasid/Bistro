import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Percent, 
  Receipt, 
  Search, 
  Clock, 
  Table,
  UtensilsCrossed,
  ShoppingBag,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { MenuItem, MenuCategory, Order, OrderItem } from '../types';

interface OrderManagementViewProps {
  menuItems: MenuItem[];
  tables: { number: number; capacity: number; status: string }[];
  preselectedTableNumber: number | null;
  onClearPreselectedTable: () => void;
  onAddOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
  themeStyle: 'gold' | 'platinum';
}

export default function OrderManagementView({
  menuItems,
  tables,
  preselectedTableNumber,
  onClearPreselectedTable,
  onAddOrder,
  themeStyle
}: OrderManagementViewProps) {
  // Navigation / Filter states
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart / Ticket build states
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [showCustomDiscount, setShowCustomDiscount] = useState(false);
  const [ticketNotes, setTicketNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Set pre-selected table if coming from Seating view
  useEffect(() => {
    if (preselectedTableNumber !== null) {
      setSelectedTable(preselectedTableNumber);
      // Immediately clear so it doesn't force locks if tab changes
      onClearPreselectedTable();
    }
  }, [preselectedTableNumber]);

  // Filtering Menu list
  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    if (!item.available) return;
    
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.menuItemId === item.id);
      if (existing) {
        return prevCart.map((ci) => 
          ci.menuItemId === item.id 
            ? { ...ci, quantity: ci.quantity + 1 } 
            : ci
        );
      } else {
        return [
          ...prevCart,
          {
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            notes: ''
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (menuItemId: string, change: number) => {
    setCart((prevCart) => {
      return prevCart.map((ci) => {
        if (ci.menuItemId === menuItemId) {
          const nextQty = ci.quantity + change;
          return nextQty > 0 ? { ...ci, quantity: nextQty } : ci;
        }
        return ci;
      }).filter((ci) => ci.quantity > 0);
    });
  };

  const handleUpdateItemNotes = (menuItemId: string, notes: string) => {
    setCart((prevCart) => 
      prevCart.map((ci) => 
        ci.menuItemId === menuItemId ? { ...ci, notes } : ci
      )
    );
  };

  const handleRemoveFromCart = (menuItemId: string) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.menuItemId !== menuItemId));
  };

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxPercentage = 8; // standard tax from settings
  const taxAmount = taxableAmount * (taxPercentage / 100);
  const grandTotal = taxableAmount + taxAmount;

  // Submit Order Ticket to Kitchen
  const handleSubmitTicket = () => {
    if (cart.length === 0) {
      alert('Your order ticket cart is currently empty.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onAddOrder({
        tableNumber: selectedTable,
        items: cart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: discountPercent,
        tax: taxPercentage,
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        status: 'New',
        specialNotes: ticketNotes,
        waiterName: 'Sarah Jenkins' // Default demo server waiter
      });

      setIsSubmitting(false);
      setCart([]);
      setTicketNotes('');
      setDiscountPercent(0);
      setOrderSuccess(`Ticket successfully routed to KDS for Table ${selectedTable}!`);
      
      // Auto dismiss success toast after 3s
      setTimeout(() => setOrderSuccess(null), 3000);
    }, 1200);
  };

  const categories: (MenuCategory | 'All')[] = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks', 'Specials'];

  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-hidden font-sans flex flex-col justify-between" id="order-entry-viewport">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 bg-emerald-500 text-black px-5 py-3 rounded-xl font-bold flex items-center gap-2.5 shadow-2xl z-50 text-sm glow-green"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{orderSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden" id="order-entry-splits">
        
        {/* Left Side: Category Navigator & Food Catalog Grid */}
        <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden" id="order-catalog-side">
          
          {/* Header search bar and Filters */}
          <div className="space-y-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:flex-1">
                <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none w-4 h-4 my-auto" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gourmet catalog (e.g. Ribeye, Bruschetta...)"
                  className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                />
              </div>

              {/* Table Seating Dropdown Picker */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Table className="w-4 h-4 text-gold-500" />
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(parseInt(e.target.value))}
                  className="bg-[#0e0e11] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none cursor-pointer"
                >
                  {tables.map((t) => (
                    <option key={t.number} value={t.number}>
                      Seated: Table {t.number} (Max {t.capacity}) - {t.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category horizontal scroller */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    activeCategory === cat
                      ? 'bg-amber-500/10 border border-gold-500/35 text-gold-500 shadow-md'
                      : 'bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat} Tab
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Food Cards Grid scroll panel */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 pr-1.5 pb-4">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddToCart(item)}
                className={`glass-card p-3 rounded-2xl flex flex-col justify-between transition-all cursor-pointer relative select-none overflow-hidden h-[270px] group ${
                  item.available 
                    ? 'hover:border-gold-500/30' 
                    : 'opacity-50 border-red-500/10 cursor-not-allowed'
                }`}
              >
                {/* Image & Price Indicator */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-[#0e0e11]/85 border border-white/10 px-2.5 py-1 rounded-lg font-mono text-xs font-bold text-gold-500">
                    ${item.price.toFixed(2)}
                  </div>

                  {!item.available && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Title & details */}
                <div className="text-left space-y-1">
                  <h4 className="text-xs font-bold text-white tracking-tight leading-tight truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 line-clamp-2 h-7 font-sans leading-normal">
                    {item.description}
                  </p>
                </div>

                {/* Preparation Time footer */}
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.04] text-[10px] text-gray-500">
                  <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-gray-400 uppercase font-medium text-[9px]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-500/70" />
                    <span>{item.preparationTime} mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Active Ticket Cart Summary Panel */}
        <div className="lg:col-span-5 glass-card rounded-2xl flex flex-col justify-between overflow-hidden" id="order-cart-side">
          
          {/* Header summary */}
          <div className="p-4 border-b border-white/5 bg-[#121215] flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gold-500" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Live Ticket: Table {selectedTable}</span>
            </div>
            <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-mono font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
            </span>
          </div>

          {/* Cart Item Row List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none" id="order-cart-list">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <UtensilsCrossed className="w-10 h-10 text-gray-600 mb-3 animate-pulse" />
                <p className="text-xs font-medium">Ticket Cart is Empty.</p>
                <p className="text-[10px] text-gray-600 mt-1 max-w-xs">Select gourmet plates from the catalog to build active table orders.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.menuItemId} 
                  className="p-3 bg-white/[0.01] border border-white/[0.03] hover:border-white/[0.08] rounded-xl space-y-2 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-bold text-white">{item.name}</h5>
                      <span className="text-[10px] font-mono text-gold-500">${item.price.toFixed(2)} each</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2.5 bg-[#0e0e11] border border-white/5 rounded-lg px-2 py-1 shrink-0">
                      <button 
                        onClick={() => handleUpdateQuantity(item.menuItemId, -1)}
                        className="text-gray-400 hover:text-gold-500 p-0.5 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold text-white w-3 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.menuItemId, 1)}
                        className="text-gray-400 hover:text-gold-500 p-0.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Item annotations / notes */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => handleUpdateItemNotes(item.menuItemId, e.target.value)}
                      placeholder="Chef notes: e.g. Extra spicy, rare..."
                      className="flex-1 bg-black/40 border border-white/[0.03] focus:border-gold-500/30 focus:outline-none rounded px-2.5 py-1 text-[10px] text-gray-300 font-sans"
                    />
                    
                    <button
                      onClick={() => handleRemoveFromCart(item.menuItemId)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      title="Delete plate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing calculations footer */}
          <div className="p-4 border-t border-white/5 bg-[#121215] space-y-3.5" id="order-cart-totals">
            {/* Discount Select Panel */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-gold-500" />
                <span>Apply Campaign Discount</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[0, 5, 10, 15, 20].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDiscountPercent(d);
                      setShowCustomDiscount(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono border cursor-pointer transition-all ${
                      discountPercent === d && !showCustomDiscount
                        ? 'bg-amber-500/10 border-gold-500 text-gold-500'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {d === 0 ? 'No Discount' : `${d}% Off`}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCustomDiscount(!showCustomDiscount)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono border cursor-pointer transition-all ${
                    showCustomDiscount
                      ? 'bg-amber-500/10 border-gold-500 text-gold-500'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Custom...
                </button>
              </div>

              {showCustomDiscount && (
                <div className="flex items-center gap-2.5 bg-black/20 p-2 border border-white/5 rounded-xl">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                    className="flex-1 accent-gold-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono font-bold text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded shrink-0">
                    {discountPercent}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* General Ticket Special Comments */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">General Table Notes</label>
              <textarea
                value={ticketNotes}
                onChange={(e) => setTicketNotes(e.target.value)}
                rows={1.5}
                placeholder="e.g. Allergies table. Split check requested at finish..."
                className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2 px-3 text-xs text-gray-300 placeholder-gray-600 resize-none"
              />
            </div>

            {/* Math Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-white/5 font-mono text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-amber-500">
                  <span>Campaign Discount ({discountPercent}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Sales Tax (8.0%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-1.5 border-t border-dashed border-white/5">
                <span>Grand Total:</span>
                <span className="text-gold-500">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Complete checkout button */}
            <button
              onClick={handleSubmitTicket}
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-amber-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-black font-extrabold rounded-xl text-xs transition-all duration-300 shadow-lg shadow-gold-500/5 flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Transmitting Ticket...</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  <span>Transmit Ticket to Kitchen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
