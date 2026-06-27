import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Utensils, 
  ChefHat, 
  Flame, 
  BellRing, 
  CheckCheck, 
  AlertCircle,
  TrendingDown,
  Info
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface KdsViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  themeStyle: 'gold' | 'platinum';
}

export default function KdsView({
  orders,
  onUpdateOrderStatus,
  themeStyle
}: KdsViewProps) {
  // Filter out completed/cancelled/served orders for the live kitchen display
  const activeKdsOrders = orders.filter((o) => 
    ['New', 'Preparing', 'Ready'].includes(o.status)
  );

  // Helper to compute elapsed time in minutes
  const getElapsedMinutes = (isoString: string) => {
    const elapsedMs = Date.now() - new Date(isoString).getTime();
    return Math.max(0, Math.floor(elapsedMs / (60 * 1000)));
  };

  // State to force-re-render elapsed timers every 15 seconds
  const [, setTimerState] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerState(t => t + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Split into columns
  const queuedOrders = activeKdsOrders.filter((o) => o.status === 'New');
  const preparingOrders = activeKdsOrders.filter((o) => o.status === 'Preparing');
  const readyOrders = activeKdsOrders.filter((o) => o.status === 'Ready');

  return (
    <div className="p-6 space-y-6 font-sans h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden" id="kds-viewport">
      
      {/* 1. Header KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 shrink-0" id="kds-stats">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-bold">In-Queue Queue</span>
            <p className="text-xl font-bold text-white font-mono">{queuedOrders.length} tickets</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/15">
            <Utensils className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-amber-500 uppercase font-bold">Currently Cooking</span>
            <p className="text-xl font-bold text-amber-400 font-mono">{preparingOrders.length} tables</p>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/15">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-emerald-500 uppercase font-bold">Ready for Delivery</span>
            <p className="text-xl font-bold text-emerald-400 font-mono">{readyOrders.length} dishes</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/15">
            <BellRing className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-bold">Avg Prep Performance</span>
            <p className="text-xl font-bold text-white font-mono">14.5 minutes</p>
          </div>
          <div className="p-2.5 bg-white/5 text-gray-300 rounded-lg border border-white/5">
            <TrendingDown className="w-4 h-4 text-gold-500" />
          </div>
        </div>
      </div>

      {/* 2. Column Swimlane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 overflow-hidden" id="kds-columns">
        
        {/* COLUMN 1: NEW / QUEUED */}
        <div className="flex flex-col bg-white/[0.01] border border-white/[0.04] rounded-2xl overflow-hidden p-4 text-left">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 glow-blue" />
              <h4 className="font-display font-extrabold text-sm text-white">In Queue</h4>
            </div>
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold">
              {queuedOrders.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
            {queuedOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                <ChefHat className="w-8 h-8 mb-2 opacity-35" />
                <p className="text-xs">No pending orders in queue.</p>
              </div>
            ) : (
              queuedOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.createdAt);
                const isUrgent = elapsed >= 15;
                
                return (
                  <motion.div
                    key={order.id}
                    layoutId={`kds-card-${order.id}`}
                    className={`p-4 rounded-2xl glass-card transition-all relative space-y-3 flex flex-col justify-between ${
                      isUrgent ? 'border-red-500/30 glow-red' : 'hover:border-white/15'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-2.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                            Table {order.tableNumber}
                          </span>
                          <span className="text-[9px] font-mono text-gray-600 ml-1.5">{order.orderNumber}</span>
                        </div>

                        {/* Urgent tag */}
                        <div className={`flex items-center gap-1 font-mono text-[10px] ${
                          isUrgent ? 'text-red-400 font-bold animate-pulse' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{elapsed} min ago</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs text-left" id="order-items-list">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between">
                            <span className="text-gray-300 font-medium">
                              <strong className="text-white font-bold">{item.quantity}x</strong> {item.name}
                            </span>
                            {item.notes && (
                              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.2 rounded italic text-right max-w-[140px] truncate">
                                "{item.notes}"
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* General Table notes */}
                      {order.specialNotes && (
                        <div className="mt-3 p-2 bg-[#121215] border border-white/5 rounded-xl text-[10px] text-amber-500 italic">
                          💡 Notes: {order.specialNotes}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                      className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/35 hover:border-blue-500 text-blue-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Start Preparing</span>
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: PREPARING / COOKING */}
        <div className="flex flex-col bg-white/[0.01] border border-white/[0.04] rounded-2xl overflow-hidden p-4 text-left">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 glow-orange" />
              <h4 className="font-display font-extrabold text-sm text-white">Cooking / Preparing</h4>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold">
              {preparingOrders.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
            {preparingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                <Flame className="w-8 h-8 mb-2 opacity-35" />
                <p className="text-xs">No tickets currently cooking.</p>
              </div>
            ) : (
              preparingOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.createdAt);
                const isUrgent = elapsed >= 20;

                return (
                  <motion.div
                    key={order.id}
                    layoutId={`kds-card-${order.id}`}
                    className={`p-4 rounded-2xl glass-card transition-all relative space-y-3 flex flex-col justify-between ${
                      isUrgent ? 'border-red-500/30 glow-red' : 'hover:border-white/15'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-2.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                            Table {order.tableNumber}
                          </span>
                          <span className="text-[9px] font-mono text-gray-600 ml-1.5">{order.orderNumber}</span>
                        </div>

                        {/* Elapsed time */}
                        <div className={`flex items-center gap-1 font-mono text-[10px] ${
                          isUrgent ? 'text-red-400 font-bold animate-pulse' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{elapsed} min ago</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs text-left">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between">
                            <span className="text-gray-300 font-medium">
                              <strong className="text-white font-bold">{item.quantity}x</strong> {item.name}
                            </span>
                            {item.notes && (
                              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.2 rounded italic text-right max-w-[140px] truncate">
                                "{item.notes}"
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* General Table notes */}
                      {order.specialNotes && (
                        <div className="mt-3 p-2 bg-[#121215] border border-white/5 rounded-xl text-[10px] text-amber-500 italic">
                          💡 Notes: {order.specialNotes}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'Ready')}
                      className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/15 border border-gold-500/35 hover:border-gold-500 text-gold-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Ready for Pickup</span>
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: READY / DELIVERING */}
        <div className="flex flex-col bg-white/[0.01] border border-white/[0.04] rounded-2xl overflow-hidden p-4 text-left">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 glow-green animate-pulse" />
              <h4 className="font-display font-extrabold text-sm text-white">Ready for Delivery</h4>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
              {readyOrders.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
            {readyOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                <BellRing className="w-8 h-8 mb-2 opacity-35" />
                <p className="text-xs">No active orders waiting delivery.</p>
              </div>
            ) : (
              readyOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.createdAt);

                return (
                  <motion.div
                    key={order.id}
                    layoutId={`kds-card-${order.id}`}
                    className="p-4 rounded-2xl glass-card transition-all relative border-emerald-500/20 glow-green space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-2.5">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                            Table {order.tableNumber}
                          </span>
                          <span className="text-[9px] font-mono text-gray-600 ml-1.5">{order.orderNumber}</span>
                        </div>

                        {/* Elapsed time */}
                        <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400 font-semibold animate-pulse">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Ready {elapsed}m</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs text-left">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between">
                            <span className="text-gray-300 font-medium">
                              <strong className="text-white font-bold">{item.quantity}x</strong> {item.name}
                            </span>
                            {item.notes && (
                              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.2 rounded italic text-right max-w-[140px] truncate">
                                "{item.notes}"
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* General Table notes */}
                      {order.specialNotes && (
                        <div className="mt-3 p-2 bg-[#121215] border border-white/5 rounded-xl text-[10px] text-amber-500 italic">
                          💡 Notes: {order.specialNotes}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'Served')}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-black text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Delivered to Table</span>
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* 3. Footer help tag */}
      <div className="flex items-center gap-2 bg-[#121215] p-3 border border-white/5 rounded-xl shrink-0 text-xs text-gray-400 text-left">
        <Info className="w-4 h-4 text-gold-500 shrink-0" />
        <span>KDS triggers auto-re-renders every 15s to keep chef preparation ticket elapsed duration metrics precise. Priority thresholds turn cards glowing red after 15-20 minutes.</span>
      </div>
    </div>
  );
}
