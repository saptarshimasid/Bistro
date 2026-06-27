import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Activity, 
  Clock, 
  Users, 
  Utensils, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Award,
  HeartHandshake,
  Crown,
  Search,
  Star,
  ThumbsUp,
  Trash2,
  Plus,
  Archive,
  Filter,
  MessageSquare,
  PlusCircle,
  X,
  Sparkles,
  Target,
  Edit3,
  Check
} from 'lucide-react';
import { Order, Table, Reservation, InventoryItem, LiveActivity, StaffMember, CustomerFeedback } from '../types';

interface DashboardViewProps {
  orders: Order[];
  tables: Table[];
  reservations: Reservation[];
  inventory: InventoryItem[];
  activities: LiveActivity[];
  staff: StaffMember[];
  feedbacks: CustomerFeedback[];
  onAddFeedback: (fb: Omit<CustomerFeedback, 'id' | 'createdAt'>) => void;
  onUpdateFeedbackStatus: (id: string, status: CustomerFeedback['status']) => void;
  onDeleteFeedback: (id: string) => void;
  themeStyle: 'gold' | 'platinum';
  setTab: (tab: string) => void;
}

export default function DashboardView({
  orders,
  tables,
  reservations,
  inventory,
  activities,
  staff,
  feedbacks,
  onAddFeedback,
  onUpdateFeedbackStatus,
  onDeleteFeedback,
  themeStyle,
  setTab
}: DashboardViewProps) {

  const [showLowStockDetails, setShowLowStockDetails] = React.useState(false);
  const [crmSearch, setCrmSearch] = React.useState('');

  // Daily Revenue Goal Target states
  const [dailyTarget, setDailyTarget] = React.useState<number>(() => {
    const saved = localStorage.getItem('dineflow_daily_revenue_target');
    return saved ? parseFloat(saved) : 2500;
  });
  const [isEditingTarget, setIsEditingTarget] = React.useState(false);
  const [tempTarget, setTempTarget] = React.useState(dailyTarget.toString());

  const handleSaveTarget = () => {
    const num = parseFloat(tempTarget);
    if (!isNaN(num) && num > 0) {
      setDailyTarget(num);
      localStorage.setItem('dineflow_daily_revenue_target', num.toString());
      setIsEditingTarget(false);
    } else {
      alert('Please enter a valid target amount.');
    }
  };

  // Feedback states
  const [fbFilterStatus, setFbFilterStatus] = React.useState<'All' | 'Pending' | 'Approved' | 'Archived'>('All');
  const [fbFilterRating, setFbFilterRating] = React.useState<'All' | number>('All');
  const [fbFilterCategory, setFbFilterCategory] = React.useState<'All' | 'Food Quality' | 'Service' | 'Ambiance' | 'Cleanliness' | 'General'>('All');
  const [showAddFeedbackModal, setShowAddFeedbackModal] = React.useState(false);
  
  // New Feedback form states
  const [newFbName, setNewFbName] = React.useState('');
  const [newFbRating, setNewFbRating] = React.useState(5);
  const [newFbComment, setNewFbComment] = React.useState('');
  const [newFbCategory, setNewFbCategory] = React.useState<'Food Quality' | 'Service' | 'Ambiance' | 'Cleanliness' | 'General'>('General');
  const [newFbWaiterId, setNewFbWaiterId] = React.useState('');

  // CRM Loyalty aggregation
  const guestProfiles = React.useMemo(() => {
    interface MapEntry {
      name: string;
      reservationCount: number;
      orderCount: number;
      totalSpend: number;
      lastVisitTime: number;
      payments: { [key: string]: number };
      itemsOrdered: number;
    }
    const guestMap = new Map<string, MapEntry>();

    // Helper to normalize guest name to title case
    const normalizeName = (nameStr: string) => {
      if (!nameStr) return '';
      return nameStr.trim().replace(/\s+/g, ' ').toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    };

    // 1. Process Reservations
    reservations.forEach((res) => {
      const rawName = res.customerName;
      if (!rawName) return;
      const name = normalizeName(rawName);
      if (!name || name === 'Guest' || name === 'Walk-in' || name === 'Walk-In') return;

      const existing = guestMap.get(name) || {
        name,
        reservationCount: 0,
        orderCount: 0,
        totalSpend: 0,
        lastVisitTime: 0,
        payments: {},
        itemsOrdered: 0
      };

      existing.reservationCount += 1;
      
      const resDateTime = new Date(`${res.date}T${res.time || '18:00'}`).getTime();
      if (!isNaN(resDateTime) && resDateTime > existing.lastVisitTime) {
        existing.lastVisitTime = resDateTime;
      }

      guestMap.set(name, existing);
    });

    // 2. Process Orders
    orders.forEach((ord) => {
      const rawName = ord.customerName;
      if (!rawName) return;
      const name = normalizeName(rawName);
      if (!name || name === 'Guest' || name === 'Walk-in' || name === 'Walk-In') return;

      const existing = guestMap.get(name) || {
        name,
        reservationCount: 0,
        orderCount: 0,
        totalSpend: 0,
        lastVisitTime: 0,
        payments: {},
        itemsOrdered: 0
      };

      existing.orderCount += 1;
      existing.totalSpend += ord.grandTotal || 0;
      
      const totalItemsCount = ord.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      existing.itemsOrdered += totalItemsCount;

      const ordTime = new Date(ord.updatedAt || ord.createdAt).getTime();
      if (!isNaN(ordTime) && ordTime > existing.lastVisitTime) {
        existing.lastVisitTime = ordTime;
      }

      if (ord.paymentMethod) {
        existing.payments[ord.paymentMethod] = (existing.payments[ord.paymentMethod] || 0) + 1;
      }

      guestMap.set(name, existing);
    });

    // 3. Compute Scores and Map to Profiles
    return Array.from(guestMap.values()).map((g) => {
      // Formula: 15 points per reservation, 20 points per order, 1 point per $10 of spend
      const reservationPoints = g.reservationCount * 15;
      const orderPoints = g.orderCount * 20;
      const spendPoints = Math.round(g.totalSpend * 0.1);
      const score = reservationPoints + orderPoints + spendPoints;

      // Determine Loyalty Tier & Badge Style
      let tier = 'Bronze Diner';
      let tierColor = 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      let description = 'New recurring diner';
      
      if (score >= 200) {
        tier = 'VIP Black Elite';
        tierColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-sm shadow-purple-500/15 font-bold';
        description = 'Top tier gastronomy regular';
      } else if (score >= 100) {
        tier = 'Gold Regular';
        tierColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30 font-bold';
        description = 'Highly valued repeat regular';
      } else if (score >= 45) {
        tier = 'Silver Member';
        tierColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
        description = 'Active repeat customer';
      }

      let preferredPayment = 'None';
      let maxCount = 0;
      Object.entries(g.payments).forEach(([pm, count]) => {
        if (count > maxCount) {
          maxCount = count;
          preferredPayment = pm;
        }
      });

      return {
        name: g.name,
        reservationCount: g.reservationCount,
        orderCount: g.orderCount,
        totalSpend: g.totalSpend,
        loyaltyScore: score,
        tier,
        tierColor,
        description,
        lastVisit: g.lastVisitTime > 0 ? new Date(g.lastVisitTime).toLocaleDateString() : 'N/A',
        preferredPayment,
        itemsOrdered: g.itemsOrdered
      };
    })
    .sort((a, b) => b.loyaltyScore - a.loyaltyScore); // High loyalty score first
  }, [orders, reservations]);

  // Helper to find guest badge dynamically based on name
  const findGuestBadge = React.useCallback((nameStr: string) => {
    const normalized = nameStr.trim().toLowerCase();
    const profile = guestProfiles.find(p => p.name.trim().toLowerCase() === normalized);
    if (!profile) return null;
    
    if (profile.loyaltyScore >= 200) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono shadow-[0_0_8px_rgba(168,85,247,0.25)] shrink-0" title={`VIP Elite (Score: ${profile.loyaltyScore})`}>
          <Crown className="w-2.5 h-2.5 text-purple-400" /> VIP Elite
        </span>
      );
    } else if (profile.loyaltyScore >= 100) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-500/20 text-amber-400 border border-amber-500/45 font-mono shadow-[0_0_8px_rgba(245,158,11,0.2)] shrink-0" title={`Gold (Score: ${profile.loyaltyScore})`}>
          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400/30" /> Gold
        </span>
      );
    } else if (profile.loyaltyScore >= 45) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-slate-300/10 text-slate-300 border border-slate-300/20 font-mono shrink-0" title={`Silver (Score: ${profile.loyaltyScore})`}>
          <Sparkles className="w-2.5 h-2.5 text-slate-300" /> Silver
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-amber-700/15 text-amber-600 border border-amber-700/20 font-mono shrink-0" title={`Bronze (Score: ${profile.loyaltyScore})`}>
          <Award className="w-2.5 h-2.5 text-amber-600" /> Bronze
        </span>
      );
    }
  }, [guestProfiles]);

  // Staff Excellence Leaderboard Data
  const staffLeaderboard = React.useMemo(() => {
    // Filter staff who are Waiters
    const waiters = staff.filter(member => member.role === 'Waiter');
    
    return waiters.map(member => {
      // Get all orders assigned to this waiter
      const waiterOrders = orders.filter(o => o.waiterId === member.id);
      const completedOrders = waiterOrders.filter(o => o.status === 'Paid' || o.status === 'Served');
      
      // Calculate completion efficiency (time-based)
      let avgMinutes = 0;
      if (completedOrders.length > 0) {
        const totalMins = completedOrders.reduce((sum, o) => {
          if (!o.createdAt || !o.updatedAt) return sum + 15;
          const created = new Date(o.createdAt).getTime();
          const updated = new Date(o.updatedAt).getTime();
          const diff = (updated - created) / (1000 * 60);
          return sum + (diff > 0 ? diff : 15);
        }, 0);
        avgMinutes = totalMins / completedOrders.length;
      } else {
        // Fallback with highly realistic variation based on their performance rating
        avgMinutes = 30 - (member.performanceRating * 3);
      }
      
      // Order completion efficiency score out of 100
      // Under 15 mins -> 100%, 40 mins -> 40%
      const efficiencyScore = Math.max(40, Math.min(100, Math.round(120 - (avgMinutes * 2))));
      
      // Customer Feedback Score: mapped from performanceRating which is 1-5
      const feedbackScore = member.performanceRating;
      
      // Combined Excellence Score (50% efficiency + 50% feedback percentage)
      const combinedScore = Math.round((efficiencyScore + (feedbackScore * 20)) / 2);
      
      // Some realistic feedback quotes/reviews based on their rating
      const reviews = [
        "Incredibly fast and polite! Made our dining experience unforgettable.",
        "Always attentive and ensured our meals arrived hot and fresh.",
        "Exceptional service, highly professional and very helpful with menu recommendations.",
        "Very friendly and prompt service. We had a great time!",
        "Excellent hospitality, kept our water glasses full and orders perfectly accurate."
      ];
      // Pick a review based on their ID hash or rating
      const reviewIndex = Math.abs(member.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % reviews.length;
      const recentReview = reviews[reviewIndex];

      return {
        ...member,
        completedCount: completedOrders.length,
        avgMinutes: parseFloat(avgMinutes.toFixed(1)),
        efficiencyScore,
        feedbackScore,
        combinedScore,
        recentReview
      };
    }).sort((a, b) => b.combinedScore - a.combinedScore); // Sort by highest combined score first
  }, [staff, orders]);

  const filteredFeedbacks = React.useMemo(() => {
    return feedbacks.filter(fb => {
      const matchStatus = fbFilterStatus === 'All' || fb.status === fbFilterStatus;
      const matchRating = fbFilterRating === 'All' || fb.rating === fbFilterRating;
      const matchCategory = fbFilterCategory === 'All' || fb.category === fbFilterCategory;
      return matchStatus && matchRating && matchCategory;
    });
  }, [feedbacks, fbFilterStatus, fbFilterRating, fbFilterCategory]);

  const waiters = React.useMemo(() => {
    return staff.filter(s => s.role === 'Waiter');
  }, [staff]);

  // Theme configuration colors
  const primaryGlowColor = themeStyle === 'gold' ? '#d4af37' : '#22d3ee';
  const accentGlowColor = themeStyle === 'gold' ? '#f59e0b' : '#3b82f6';

  // Math Metrics
  const completedOrders = orders.filter(o => o.status === 'Paid');
  const activeOrders = orders.filter(o => o.status !== 'Paid' && o.status !== 'Cancelled');
  
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrdersCount = orders.length;
  
  const pendingCount = orders.filter(o => ['New', 'Preparing', 'Ready'].includes(o.status)).length;
  const completedCount = completedOrders.length;
  
  const occupiedTables = tables.filter(t => t.status === 'Occupied').length;
  const totalTablesCount = tables.length;
  
  const lowStockCount = inventory.filter(i => i.currentStock <= i.minimumStock).length;
  const todayReservationsCount = reservations.filter(r => r.status === 'Confirmed').length;

  // 1. Chart Data: Hourly/Daily Sales Trend
  const salesTrendData = [
    { name: '11:00 AM', sales: 420, orders: 8 },
    { name: '01:00 PM', sales: 1250, orders: 19 },
    { name: '03:00 PM', sales: 650, orders: 11 },
    { name: '05:00 PM', sales: 1100, orders: 16 },
    { name: '07:00 PM', sales: 2450, orders: 34 },
    { name: '09:00 PM', sales: 1850, orders: 25 },
    { name: '11:00 PM', sales: 980, orders: 12 },
  ];

  // 2. Category Pie Data
  const categorySplitData = [
    { name: 'Starters', value: 340, color: '#f59e0b' },
    { name: 'Main Course', value: 890, color: themeStyle === 'gold' ? '#d4af37' : '#06b6d4' },
    { name: 'Drinks', value: 240, color: '#10b981' },
    { name: 'Desserts', value: 190, color: '#ec4899' },
    { name: 'Specials', value: 410, color: '#8b5cf6' },
  ];

  // 3. Top Menu Items (Calculated or Mock)
  const topMenuItems = [
    { name: 'Prime Dry-Aged Ribeye', quantity: 24, revenue: 1176, pct: 90 },
    { name: 'Gourmet Wagyu Truffle Burger', quantity: 18, revenue: 756, pct: 75 },
    { name: 'Truffle Parmesan Fries', quantity: 35, revenue: 490, pct: 60 },
    { name: 'Pan-Seared Atlantic Salmon', quantity: 11, revenue: 396, pct: 45 },
  ];

  // Container variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6 overflow-x-hidden font-sans"
    >
      {/* Inventory Low Stock Notification Banner */}
      {lowStockCount > 0 && (
        <motion.div
          variants={itemVariants}
          className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
            themeStyle === 'gold' 
              ? 'bg-amber-950/25 border-amber-500/20 shadow-lg shadow-amber-500/5' 
              : 'bg-cyan-950/25 border-cyan-500/20 shadow-lg shadow-cyan-500/5'
          }`}
          id="inventory-warning-banner"
        >
          {/* Subtle background gradient pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start sm:items-center gap-3 text-left">
              <div className={`p-3 rounded-xl shrink-0 ${
                themeStyle === 'gold'
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}>
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono uppercase tracking-widest font-extrabold px-2 py-0.5 rounded ${
                    themeStyle === 'gold' ? 'bg-amber-500/25 text-amber-300' : 'bg-cyan-500/25 text-cyan-300'
                  }`}>
                    Inventory Warning
                  </span>
                  <span className="text-xs font-mono text-gray-500">• {lowStockCount} items below threshold</span>
                </div>
                <h4 className="font-display font-bold text-white text-sm sm:text-base tracking-tight">
                  Critical Stock Threshold Reached
                </h4>
                <p className="text-xs text-gray-400 max-w-xl">
                  Some gourmet ingredients have fallen below their safety threshold. Please review the listed ingredients and restock to avoid kitchen menu disruptions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:self-center shrink-0">
              <button
                onClick={() => setShowLowStockDetails(!showLowStockDetails)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  showLowStockDetails
                    ? 'bg-white/10 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
                id="toggle-low-stock-details-btn"
              >
                <span>{showLowStockDetails ? 'Hide Details' : 'View Items'}</span>
                {showLowStockDetails ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              <button
                onClick={() => setTab('inventory')}
                className={`px-4 py-2 text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer uppercase tracking-wider ${
                  themeStyle === 'gold'
                    ? 'bg-gradient-to-r from-amber-400 to-gold-500 shadow-amber-500/10 hover:brightness-110'
                    : 'bg-gradient-to-r from-cyan-400 to-teal-500 shadow-cyan-500/10 hover:brightness-110'
                }`}
                id="resolve-low-stock-btn"
              >
                <span>Restock Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expandable Details Section */}
          {showLowStockDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="border-t border-white/5 bg-black/15 overflow-hidden"
              id="low-stock-details-drawer"
            >
              <div className="p-4 sm:p-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {inventory
                    .filter((item) => item.currentStock <= item.minimumStock)
                    .map((item) => {
                      const ratio = item.minimumStock > 0 ? (item.currentStock / item.minimumStock) : 0;
                      const progressPercent = Math.min(Math.max(ratio * 100, 0), 100);
                      
                      return (
                        <div 
                          key={item.id}
                          className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-gray-200 truncate">{item.name}</h5>
                              <p className="text-[10px] text-gray-500 font-mono truncate">{item.category} • {item.supplier}</p>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/10 shrink-0">
                              {progressPercent.toFixed(0)}% Stock
                            </span>
                          </div>

                          {/* Stock Progress Line */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-gray-400">Current: <strong className="text-red-400 font-bold">{item.currentStock} {item.unit}</strong></span>
                              <span className="text-gray-500">Min: {item.minimumStock} {item.unit}</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 1. Statistics Ribbon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        
        {/* Total Revenue */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
          id="stats-total-revenue"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/[0.02] rounded-full blur-2xl" />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1.5 text-left flex-1">
              <span className="text-xs text-gray-400 font-medium block">Total Daily Revenue</span>
              <h3 className="font-display text-2xl font-extrabold text-white font-mono tracking-tight leading-none">
                ${totalRevenue.toFixed(2)}
              </h3>
              
              {/* Daily Revenue Goal Setting & Display */}
              <div className="flex items-center gap-1.5 pt-1">
                {isEditingTarget ? (
                  <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg px-1 py-0.5 max-w-[150px]">
                    <span className="text-[10px] text-gray-500 font-mono">$</span>
                    <input
                      type="number"
                      value={tempTarget}
                      onChange={(e) => setTempTarget(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTarget()}
                      className="bg-transparent border-0 focus:outline-none focus:ring-0 text-[10px] text-white font-mono w-16 p-0"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveTarget}
                      className="p-0.5 hover:text-emerald-400 text-gray-400 transition-colors cursor-pointer"
                      title="Save Target"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingTarget(false);
                        setTempTarget(dailyTarget.toString());
                      }}
                      className="p-0.5 hover:text-rose-400 text-gray-400 transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                    <Target className="w-3.5 h-3.5 text-gold-500" />
                    <span>Goal: <strong className="text-gray-200">${dailyTarget}</strong></span>
                    <button
                      onClick={() => {
                        setTempTarget(dailyTarget.toString());
                        setIsEditingTarget(true);
                      }}
                      className="text-gray-500 hover:text-gold-500 transition-colors p-0.5 cursor-pointer"
                      title="Adjust Goal Target"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Glowing SVG Circular Progress Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0" id="revenue-goal-progress-ring">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="text-white/5"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Animated foreground progress circle */}
                <motion.circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="text-gold-500"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 22}
                  initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 22 - (Math.min(100, (totalRevenue / dailyTarget) * 100) / 100) * (2 * Math.PI * 22) }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Percentage Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-white font-mono leading-none">
                  {Math.round((totalRevenue / dailyTarget) * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{totalRevenue >= dailyTarget ? 'Goal Achieved!' : `$${Math.max(0, dailyTarget - totalRevenue).toFixed(0)} left`}</span>
            </span>
            <span className="text-gray-500">
              {totalRevenue >= dailyTarget ? '🔥 Outstanding' : `${Math.min(100, Math.round((totalRevenue / dailyTarget) * 100))}% Complete`}
            </span>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-2xl" />
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-xs text-gray-400 font-medium">Total Seated Tickets</span>
              <h3 className="font-display text-2xl font-bold text-white font-mono tracking-tight">
                {totalOrdersCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-400 flex justify-between">
            <span className="font-mono text-gold-500 font-semibold">{pendingCount} Active In-Kitchen</span>
            <span className="font-mono text-gray-500">{completedCount} Paid Out</span>
          </div>
        </motion.div>

        {/* Table Availability */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-xs text-gray-400 font-medium">Table Seating Utilization</span>
              <h3 className="font-display text-2xl font-bold text-white font-mono tracking-tight">
                {occupiedTables} <span className="text-gray-500 text-sm">/ {totalTablesCount} Seated</span>
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(occupiedTables / totalTablesCount) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Alerts / Reservations / Stocks */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300 ${
            lowStockCount > 0 ? 'glow-red-pulse border-red-500/20' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-xs text-gray-400 font-medium">Kitchen Operations Status</span>
              {lowStockCount > 0 ? (
                <h3 className="font-display text-lg font-bold text-red-400 tracking-tight flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>{lowStockCount} Critical Stocks</span>
                </h3>
              ) : (
                <h3 className="font-display text-2xl font-bold text-emerald-400 tracking-tight">
                  Nominal
                </h3>
              )}
            </div>
            <div className={`p-3 rounded-xl ${
              lowStockCount > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'bg-blue-500/10 text-blue-400'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <span>Today’s Reservations: <strong className="text-white font-mono">{todayReservationsCount}</strong></span>
            {lowStockCount > 0 && (
              <button 
                onClick={() => setTab('inventory')}
                className="text-[10px] text-red-400 hover:underline font-bold"
              >
                Inspect Stock
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* 2. Charts and Activity Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-graphics">
        
        {/* Daily Sales Area Graph */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-5 rounded-2xl lg:col-span-8 flex flex-col justify-between text-left"
          id="sales-chart-panel"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-white text-sm">Hourly Sales Velocity</h4>
              <p className="text-xs text-gray-400">Peak dining hour transaction volumes</p>
            </div>
            <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300 font-mono">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryGlowColor} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={primaryGlowColor} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e0e12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#9ca3af', fontWeight: 'bold', fontSize: '11px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" name="Sales ($)" stroke={primaryGlowColor} strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Split Pie */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-5 rounded-2xl lg:col-span-4 flex flex-col text-left"
          id="category-chart-panel"
        >
          <div>
            <h4 className="font-display font-bold text-white text-sm">Revenue Share by Category</h4>
            <p className="text-xs text-gray-400">Distribution across 5 categories</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e0e12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Absolute Label */}
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Total Share</span>
              <span className="text-lg font-bold text-white font-mono">$2,070</span>
            </div>
          </div>

          {/* Simple Legend with Categories */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categorySplitData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-left">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-400 font-sans truncate">{item.name} (${item.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3. Bottom Row: Popular Menu Items & Live Events Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-bottom-row">
        
        {/* Popular Food items tracker */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-5 rounded-2xl lg:col-span-7 text-left"
          id="popular-items-panel"
        >
          <div className="mb-4">
            <h4 className="font-display font-bold text-white text-sm">Trending Gourmet Platters</h4>
            <p className="text-xs text-gray-400">Best-selling dishes measured by order counts today</p>
          </div>

          <div className="space-y-4">
            {topMenuItems.map((food, i) => (
              <div key={food.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-white/5 border border-white/10 flex items-center justify-center rounded text-gold-500 font-mono font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 font-medium">{food.name}</span>
                  </div>
                  <span className="text-gray-400 font-mono">
                    <strong className="text-white font-semibold">{food.quantity}</strong> tickets (${food.revenue})
                  </span>
                </div>
                
                {/* Custom Gradient Progress Bar */}
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${food.pct}%`,
                      backgroundImage: `linear-gradient(to right, ${primaryGlowColor}, ${accentGlowColor})`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Event Stream Terminal */}
        <motion.div
          variants={itemVariants}
          className="glass-card p-5 rounded-2xl lg:col-span-5 text-left flex flex-col justify-between"
          id="live-terminal-panel"
        >
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-white text-sm">System Audit Stream</h4>
                <p className="text-xs text-gray-400">Live operational events logs</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Online</span>
              </div>
            </div>

            {/* Event lines */}
            <div className="space-y-3 max-h-[190px] overflow-y-auto">
              {activities.slice(0, 4).map((act) => {
                let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                if (act.severity === 'danger') badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';
                if (act.severity === 'success') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (act.severity === 'warning') badgeColor = 'bg-amber-500/10 text-amber-500 border-amber-500/20';

                return (
                  <div key={act.id} className="p-2.5 bg-white/[0.01] border border-white/[0.03] rounded-xl flex items-start gap-2 text-xs">
                    <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border shrink-0 ${badgeColor}`}>
                      {act.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 leading-normal font-sans">{act.message}</p>
                      <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">
                        {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => alert('Operational audits exported to administrator CSV logs successfully!')}
            className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-gray-300 font-semibold transition-all"
          >
            Export Historical Audit Logs
          </button>
        </motion.div>
      </div>

      {/* 4. Staff Excellence Leaderboard */}
      <motion.div
        variants={itemVariants}
        className={`glass-card p-6 rounded-2xl text-left border ${
          themeStyle === 'gold' ? 'border-gold-500/10 hover:border-gold-500/20' : 'border-cyan-500/10 hover:border-cyan-500/20'
        } transition-all duration-300 relative overflow-hidden`}
        id="staff-excellence-leaderboard"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-xl flex items-center justify-center ${
                themeStyle === 'gold' ? 'bg-gold-500/10 text-gold-500' : 'bg-cyan-500/10 text-cyan-400'
              }`}>
                <Award className="w-5 h-5 animate-pulse" />
              </span>
              <h3 className="font-display font-bold text-white text-base">Staff Excellence Leaderboard</h3>
            </div>
            <p className="text-xs text-gray-400">
              Live server evaluation mapping real-time order turnaround efficiency against aggregated guest feedback scores.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-1.5 text-[10px] font-mono text-gray-400">
            <Award className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
            <span>Updated live • Server Operations</span>
          </div>
        </div>

        {/* Top Server Spotlight Banner */}
        {staffLeaderboard.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-gold-500/[0.03] to-amber-500/[0.03] border border-gold-500/15 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="relative shrink-0">
                <img
                  src={staffLeaderboard[0].image}
                  alt={staffLeaderboard[0].name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-gold-500/50"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-black shadow-md font-mono">
                  #1
                </span>
              </div>
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white">{staffLeaderboard[0].name}</h4>
                  <span className="text-[9px] bg-gold-500/10 text-gold-400 font-mono px-1.5 py-0.5 rounded uppercase font-bold border border-gold-500/20">
                    MVP Spotlight
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 italic">
                  "{staffLeaderboard[0].recentReview}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-right self-stretch md:self-center justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
              <div className="space-y-0.5 text-left md:text-right">
                <span className="text-[9px] uppercase tracking-wider font-mono text-gray-500 block">Excellence Score</span>
                <span className="font-display font-bold text-gold-500 text-lg font-mono">
                  {staffLeaderboard[0].combinedScore}%
                </span>
              </div>
              <div className="space-y-0.5 text-left md:text-right">
                <span className="text-[9px] uppercase tracking-wider font-mono text-gray-500 block">Avg Turnaround</span>
                <span className="font-display font-bold text-white text-sm font-mono">
                  {staffLeaderboard[0].avgMinutes}m
                </span>
              </div>
              <div className="space-y-0.5 text-left md:text-right">
                <span className="text-[9px] uppercase tracking-wider font-mono text-gray-500 block">Feedback</span>
                <div className="flex items-center gap-1 text-gold-400 font-mono font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                  <span>{staffLeaderboard[0].feedbackScore}/5.0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffLeaderboard.map((member, index) => {
            let medalColor = "bg-white/5 text-gray-400 border-white/5";
            let rankGlow = "";
            if (index === 0) {
              medalColor = "bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold border-amber-400 shadow-md";
              rankGlow = "ring-2 ring-gold-500/20 border-gold-500/20 bg-gradient-to-b from-gold-500/[0.01] to-transparent";
            } else if (index === 1) {
              medalColor = "bg-gradient-to-r from-slate-300 to-slate-400 text-black font-extrabold border-slate-300 shadow-sm";
              rankGlow = "ring-1 ring-slate-400/10 border-white/10";
            } else if (index === 2) {
              medalColor = "bg-gradient-to-r from-amber-600 to-amber-700 text-white font-extrabold border-amber-600";
              rankGlow = "border-white/5";
            } else {
              rankGlow = "border-white/5 opacity-85 hover:opacity-100 transition-opacity";
            }

            return (
              <div 
                key={member.id} 
                className={`p-4 bg-white/[0.015] border rounded-xl flex flex-col justify-between space-y-3.5 relative overflow-hidden transition-all duration-300 ${rankGlow}`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute -top-1.5 -right-1.5 text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-black font-mono shadow ${medalColor}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white leading-snug">{member.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">ID: {member.id.substring(0, 5)} • {member.completedCount} tickets completed</p>
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-gray-500 block">Excellence</span>
                    <span className="font-mono font-bold text-xs text-gold-500">{member.combinedScore}%</span>
                  </div>
                </div>

                {/* Turnaround & Feedback Stats Row */}
                <div className="grid grid-cols-2 gap-2 bg-white/[0.01] border border-white/[0.03] p-2 rounded-lg text-left">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono text-gray-500">Avg Speed</span>
                    <p className="text-xs font-mono font-bold text-gray-300">{member.avgMinutes} mins</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono text-gray-500">Feedback</span>
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-gold-500">
                      <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                      <span>{member.feedbackScore}/5.0</span>
                    </div>
                  </div>
                </div>

                {/* Efficiency metrics bars */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-gray-400">Order turnaround efficiency</span>
                    <span className="text-gray-200 font-bold">{member.efficiencyScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
                          : themeStyle === 'gold'
                          ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                          : 'bg-gradient-to-r from-cyan-400 to-teal-500'
                      }`}
                      style={{ width: `${member.efficiencyScore}%` }}
                    />
                  </div>
                </div>

                {/* Guest feedback quote */}
                <div className="text-[10px] text-gray-400 italic bg-white/[0.01] px-2 py-1.5 rounded border border-dashed border-white/5 leading-relaxed text-left flex gap-1.5 items-start">
                  <ThumbsUp className="w-3 h-3 text-gold-500 shrink-0 mt-0.5" />
                  <span>"{member.recentReview}"</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 5. Guest Loyalty Ledger & CRM Hub */}
      <motion.div
        variants={itemVariants}
        className="glass-card p-6 rounded-2xl text-left"
        id="crm-loyalty-panel"
      >
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                themeStyle === 'gold' ? 'bg-amber-500/10 text-amber-500' : 'bg-cyan-500/10 text-cyan-400'
              }`}>
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h4 className="font-display font-bold text-white text-base">Guest Loyalty Ledger (CRM Lite)</h4>
            </div>
            <p className="text-xs text-gray-400">Dynamic recognition scores computed from reservation cycles and billing records</p>
          </div>

          {/* Search bar inside the ledger */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guests or tiers..."
              value={crmSearch}
              onChange={(e) => setCrmSearch(e.target.value)}
              className="w-full bg-white/5 hover:bg-white/[0.08] focus:bg-white/[0.08] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none focus:border-white/20 transition-all font-mono"
            />
          </div>
        </div>

        {/* Guest Profiles Table Container */}
        <div className="overflow-x-auto rounded-xl border border-white/5 scrollbar-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Guest Details</th>
                <th className="py-3 px-4 text-center">Reservations</th>
                <th className="py-3 px-4 text-center">Orders Placed</th>
                <th className="py-3 px-4 text-right">Total Invested</th>
                <th className="py-3 px-4">Loyalty Score</th>
                <th className="py-3 px-4 text-center">Last Seated</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-xs">
              {guestProfiles.filter(profile => 
                profile.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
                profile.tier.toLowerCase().includes(crmSearch.toLowerCase())
              ).length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-mono">
                    No matching loyalty guest profiles found.
                  </td>
                </tr>
              ) : (
                guestProfiles.filter(profile => 
                  profile.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
                  profile.tier.toLowerCase().includes(crmSearch.toLowerCase())
                ).map((guest) => {
                  // Determine score progress width
                  const maxScorePossible = 300;
                  const progressPercentage = Math.min((guest.loyaltyScore / maxScorePossible) * 100, 100);
                  
                  return (
                    <tr 
                      key={guest.name} 
                      className="hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Name & Tier */}
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="flex items-center gap-2.5">
                          {/* Mini Avatar / initials placeholder */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            guest.loyaltyScore >= 200 
                              ? 'bg-purple-500/20 text-purple-300 ring-2 ring-purple-500/20' 
                              : guest.loyaltyScore >= 100
                              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/20'
                              : 'bg-white/5 text-gray-300'
                          }`}>
                            {guest.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-gray-200 truncate">{guest.name}</span>
                              {findGuestBadge(guest.name)}
                            </div>
                            <span className={`inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 rounded border mt-1 shrink-0 ${guest.tierColor}`}>
                              {guest.tier}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Reservations Count */}
                      <td className="py-4 px-4 text-center font-mono text-gray-300">
                        <div className="flex flex-col items-center justify-center">
                          <span className="font-bold text-white">{guest.reservationCount}</span>
                          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tight">visits</span>
                        </div>
                      </td>

                      {/* Orders Count & Items */}
                      <td className="py-4 px-4 text-center font-mono">
                        <div className="flex flex-col items-center justify-center">
                          <span className="font-bold text-white">{guest.orderCount}</span>
                          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tight">{guest.itemsOrdered} items</span>
                        </div>
                      </td>

                      {/* Total Cumulative Spend */}
                      <td className="py-4 px-4 text-right font-mono text-white font-bold">
                        <div className="flex flex-col items-end justify-center">
                          <span>${guest.totalSpend.toFixed(2)}</span>
                          <span className="text-[9px] text-gray-500 uppercase font-normal">paid bills</span>
                        </div>
                      </td>

                      {/* Score Progress Meter */}
                      <td className="py-4 px-4 min-w-[150px]">
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className={`font-extrabold ${
                              guest.loyaltyScore >= 200 ? 'text-purple-400' : 'text-gold-500'
                            }`}>{guest.loyaltyScore} Pts</span>
                            <span className="text-gray-500">Tier Ratio</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                guest.loyaltyScore >= 200 
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
                                  : guest.loyaltyScore >= 100
                                  ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                                  : 'bg-gradient-to-r from-cyan-400 to-teal-500'
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Last Visit */}
                      <td className="py-4 px-4 text-center font-mono text-gray-400">
                        {guest.lastVisit}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => {
                            const promoCode = `PROMO-VIP-${guest.name.split(' ')[0].toUpperCase()}`;
                            alert(`🌟 CRM Campaign Dispatched 🌟\n\nReward Tier: ${guest.tier}\nGuest: ${guest.name}\nCampaign Type: Compliments Drink & Appetizer Voucher\nUnique Code: ${promoCode}\n\nCode successfully copied to communications board!`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            guest.loyaltyScore >= 200
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          Send Reward
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 6. Customer Feedback & Review Hub */}
      <motion.div
        variants={itemVariants}
        className={`glass-card p-6 rounded-2xl text-left border ${
          themeStyle === 'gold' ? 'border-gold-500/10 hover:border-gold-500/20' : 'border-cyan-500/10 hover:border-cyan-500/20'
        } transition-all duration-300 relative`}
        id="customer-feedback-hub"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                themeStyle === 'gold' ? 'bg-amber-500/10 text-amber-500' : 'bg-cyan-500/10 text-cyan-400'
              }`}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <h4 className="font-display font-bold text-white text-base">Customer Feedback Management</h4>
            </div>
            <p className="text-xs text-gray-400">View and manage live guest reviews, ratings, and service experiences</p>
          </div>

          {/* Actions: Add Feedback submission trigger */}
          <button
            onClick={() => {
              setNewFbName('');
              setNewFbRating(5);
              setNewFbComment('');
              setNewFbCategory('General');
              setNewFbWaiterId('');
              setShowAddFeedbackModal(true);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              themeStyle === 'gold' 
                ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-black font-extrabold hover:opacity-90' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Customer Review</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>Filters:</span>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-mono">Status</span>
            <select
              value={fbFilterStatus}
              onChange={(e) => setFbFilterStatus(e.target.value as any)}
              className="bg-[#121215] border border-white/10 rounded-lg text-xs text-white px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-gold-500/50 font-mono"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-mono">Rating</span>
            <select
              value={fbFilterRating}
              onChange={(e) => setFbFilterRating(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="bg-[#121215] border border-white/10 rounded-lg text-xs text-white px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-gold-500/50 font-mono"
            >
              <option value="All">All ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars or less</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-mono">Category</span>
            <select
              value={fbFilterCategory}
              onChange={(e) => setFbFilterCategory(e.target.value as any)}
              className="bg-[#121215] border border-white/10 rounded-lg text-xs text-white px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-gold-500/50 font-mono"
            >
              <option value="All">All categories</option>
              <option value="Food Quality">Food Quality</option>
              <option value="Service">Service</option>
              <option value="Ambiance">Ambiance</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Quick Counter label */}
          <div className="ml-auto text-[11px] text-gray-500 font-mono">
            Showing <span className="text-white font-bold">{filteredFeedbacks.length}</span> submissions
          </div>
        </div>

        {/* Feedback submissions grid */}
        {filteredFeedbacks.length === 0 ? (
          <div className="py-12 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl w-full">
            <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2.5" />
            <p className="text-sm font-medium text-gray-400">No feedback matching your filters.</p>
            <p className="text-xs text-gray-500 font-mono mt-1">Submit a test review using the button above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeedbacks.map((fb) => {
              // Get category color accent
              let catBadge = "bg-gray-500/10 border-gray-500/20 text-gray-400";
              if (fb.category === "Food Quality") catBadge = "bg-rose-500/10 border-rose-500/20 text-rose-400";
              else if (fb.category === "Service") catBadge = "bg-amber-500/10 border-amber-500/20 text-amber-400";
              else if (fb.category === "Ambiance") catBadge = "bg-purple-500/10 border-purple-500/20 text-purple-400";
              else if (fb.category === "Cleanliness") catBadge = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";

              // Status badge
              let statusBadge = "bg-amber-500/10 border-amber-500/20 text-amber-500";
              if (fb.status === "Approved") statusBadge = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
              else if (fb.status === "Archived") statusBadge = "bg-gray-500/10 border-gray-500/20 text-gray-400";

              return (
                <div 
                  key={fb.id} 
                  className={`p-4 bg-white/[0.015] hover:bg-white/[0.025] border border-white/5 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300 relative group overflow-hidden`}
                >
                  {/* Card top row */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                        <span className="font-bold text-sm text-white truncate">{fb.customerName}</span>
                        {findGuestBadge(fb.customerName)}
                      </div>
                      <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 ${statusBadge}`}>
                        {fb.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Date */}
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                      {/* Category */}
                      {fb.category && (
                        <span className={`text-[9px] font-mono uppercase font-semibold px-1.5 rounded border ${catBadge}`}>
                          {fb.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating Stars row */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${
                          star <= fb.rating 
                            ? 'text-gold-500 fill-gold-500' 
                            : 'text-white/[0.08]'
                        }`} 
                      />
                    ))}
                  </div>

                  {/* Comment box */}
                  <div className="bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-xl text-left text-xs text-gray-300 leading-relaxed font-sans italic flex-grow">
                    "{fb.comment}"
                  </div>

                  {/* Optional waiter attribution link */}
                  {fb.waiterName && (
                    <div className="flex items-center gap-1.5 border-t border-white/[0.03] pt-3 text-[10px] text-gray-400 font-mono text-left">
                      <ThumbsUp className="w-3 h-3 text-gold-500" />
                      <span>Assigned Waiter:</span>
                      <span className="font-bold text-white bg-white/5 px-1.5 py-0.5 rounded">{fb.waiterName}</span>
                    </div>
                  )}

                  {/* Management actions footer panel */}
                  <div className="flex items-center justify-between border-t border-white/[0.03] pt-3">
                    <div className="flex items-center gap-1.5">
                      {fb.status === 'Pending' && (
                        <button
                          onClick={() => onUpdateFeedbackStatus(fb.id, 'Approved')}
                          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-400 text-[10px] font-bold rounded-lg cursor-pointer transition-all active:scale-95"
                          title="Approve and Publish Review"
                        >
                          Approve
                        </button>
                      )}
                      {fb.status !== 'Archived' && (
                        <button
                          onClick={() => onUpdateFeedbackStatus(fb.id, 'Archived')}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all active:scale-95"
                          title="Archive Review"
                        >
                          Archive
                        </button>
                      )}
                      {fb.status === 'Archived' && (
                        <button
                          onClick={() => onUpdateFeedbackStatus(fb.id, 'Approved')}
                          className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 hover:text-purple-300 text-[10px] font-bold rounded-lg cursor-pointer transition-all active:scale-95"
                          title="Restore Review"
                        >
                          Restore
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to permanently delete review by ${fb.customerName}?`)) {
                          onDeleteFeedback(fb.id);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg cursor-pointer transition-all"
                      title="Permanently Delete Feedback"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Customer Feedback Modal Form */}
      <AnimatePresence>
        {showAddFeedbackModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#09090b] border border-white/10 p-6 rounded-2xl relative text-left shadow-2xl"
              id="feedback-submission-modal"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`p-2 rounded-xl bg-amber-500/10 text-amber-500`}>
                    <MessageSquare className="w-5 h-5 animate-pulse" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">Record Customer Feedback</h3>
                    <p className="text-xs text-gray-400">File incoming or manual service and dining experience sheets</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddFeedbackModal(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form body */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newFbName || !newFbComment) {
                    alert('Please enter a Customer Name and review comments.');
                    return;
                  }
                  const assignedWaiter = staff.find(s => s.id === newFbWaiterId);
                  onAddFeedback({
                    customerName: newFbName,
                    rating: newFbRating,
                    comment: newFbComment,
                    category: newFbCategory,
                    waiterId: newFbWaiterId || undefined,
                    waiterName: assignedWaiter ? assignedWaiter.name : undefined,
                    status: 'Approved' // Auto-approve manual inputs for high sandbox speed!
                  });
                  setShowAddFeedbackModal(false);
                }}
                className="space-y-4"
              >
                {/* Customer Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono block">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={newFbName}
                    onChange={(e) => setNewFbName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all font-sans"
                    required
                  />
                </div>

                {/* Grid: Category & Waiter */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono block">Feedback Category</label>
                    <select
                      value={newFbCategory}
                      onChange={(e) => setNewFbCategory(e.target.value as any)}
                      className="w-full bg-[#121215] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all"
                    >
                      <option value="Food Quality">Food Quality</option>
                      <option value="Service">Service</option>
                      <option value="Ambiance">Ambiance</option>
                      <option value="Cleanliness">Cleanliness</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono block">Assigned Waiter</label>
                    <select
                      value={newFbWaiterId}
                      onChange={(e) => setNewFbWaiterId(e.target.value)}
                      className="w-full bg-[#121215] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all text-gray-300"
                    >
                      <option value="" className="bg-[#121215] text-gray-400">No Waiter Assigned</option>
                      {waiters.map(w => (
                        <option key={w.id} value={w.id} className="bg-[#121215] text-white">{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Star Rating Selector */}
                <div className="space-y-2 text-left">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono block">Guest Rating</label>
                  <div className="flex items-center gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewFbRating(star)}
                          className="p-1 hover:scale-110 active:scale-95 transition-all text-gold-500 cursor-pointer"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= newFbRating 
                                ? 'text-gold-500 fill-gold-500' 
                                : 'text-white/[0.08]'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-500 ml-2">
                      {newFbRating} out of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono block">Review Comments</label>
                  <textarea
                    placeholder="Share details of customer experience (flavors, speed, attention to detail...)"
                    value={newFbComment}
                    onChange={(e) => setNewFbComment(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-all font-sans min-h-24 resize-none"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/5 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddFeedbackModal(false)}
                    className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                  >
                    Dismiss
                  </button>
                  <button
                    type="submit"
                    className={`py-2 px-5 text-xs font-extrabold rounded-xl shadow-lg active:scale-[0.98] cursor-pointer ${
                      themeStyle === 'gold'
                        ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-black shadow-gold-500/10'
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-cyan-500/15'
                    }`}
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
