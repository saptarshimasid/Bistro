import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  DollarSign, 
  Wallet, 
  Receipt, 
  Printer, 
  Check, 
  Search, 
  Smartphone, 
  Coins,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  Ban
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

const summaryContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const summaryItemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

interface BillingViewProps {
  orders: Order[];
  onPayOrder: (orderId: string, paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Wallet') => void;
  themeStyle: 'gold' | 'platinum';
}

export default function BillingView({
  orders,
  onPayOrder,
  themeStyle
}: BillingViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Wallet'>('Card');
  
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [settledSummary, setSettledSummary] = useState<{
    orderNumber: string;
    tableNumber: number;
    grandTotal: number;
    paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Wallet';
    waiterName?: string;
    subtotal: number;
    discount: number;
    tax: number;
    items: any[];
    timestamp: string;
  } | null>(null);

  // New Tab State: 'unbilled' for outstanding active orders, 'history' for finished order ledger
  const [billingTab, setBillingTab] = useState<'unbilled' | 'history'>('unbilled');
  // Sub-tabs state for order history section: 'All', 'Paid', 'Active', 'Cancelled'
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Paid' | 'Active' | 'Cancelled'>('All');

  // Active Seating (Unpaid / Unbilled) Orders
  const activeUnpaidOrders = orders.filter((o) => 
    o.status !== 'Paid' && o.status !== 'Cancelled'
  );

  // Order History Ledger (Filtered based on sub-tabs)
  const historyOrders = orders.filter((o) => {
    if (historyFilter === 'All') return true;
    if (historyFilter === 'Paid') return o.status === 'Paid';
    if (historyFilter === 'Active') return o.status !== 'Paid' && o.status !== 'Cancelled';
    if (historyFilter === 'Cancelled') return o.status === 'Cancelled';
    return true;
  });

  // Select the current active dataset to render
  const currentList = billingTab === 'unbilled' ? activeUnpaidOrders : historyOrders;

  // Apply search query to the selected list
  const filteredList = currentList.filter((o) => {
    const query = searchQuery.toLowerCase();
    return o.orderNumber.toLowerCase().includes(query) || 
           o.tableNumber.toString().includes(query) ||
           (o.waiterName && o.waiterName.toLowerCase().includes(query));
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // Handle pay out
  const handleCollectPayment = () => {
    if (!selectedOrderId || !selectedOrder) return;
    
    setIsPaying(true);

    setTimeout(() => {
      const orderCopy = { ...selectedOrder };
      onPayOrder(selectedOrderId, paymentMethod);
      setIsPaying(false);
      setPaymentSuccess(`Transaction finalized! Table ${selectedOrder.tableNumber} bill of $${selectedOrder.grandTotal.toFixed(2)} settled via ${paymentMethod}.`);
      
      setSettledSummary({
        orderNumber: orderCopy.orderNumber,
        tableNumber: orderCopy.tableNumber,
        grandTotal: orderCopy.grandTotal,
        paymentMethod: paymentMethod,
        waiterName: orderCopy.waiterName,
        subtotal: orderCopy.subtotal,
        discount: orderCopy.discount,
        tax: orderCopy.tax,
        items: orderCopy.items,
        timestamp: new Date().toISOString()
      });

      setSelectedOrderId(null);

      // Dismiss toast
      setTimeout(() => setPaymentSuccess(null), 3500);
    }, 1500);
  };

  // Simulated print duplicate from summary
  const handlePrintDuplicateFromSummary = () => {
    if (!settledSummary) return;
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      alert(`Sent bill receipt ${settledSummary.orderNumber} to thermal receipt printer 'Bistro_Front_POS_01'.`);
    }, 1200);
  };

  // Simulated print receipt
  const handlePrintInvoice = () => {
    if (!selectedOrder) return;
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      alert(`Sent bill receipt ${selectedOrder.orderNumber} to thermal receipt printer 'Bistro_Front_POS_01'.`);
    }, 1200);
  };

  // Helper to get distinctive status style badges
  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/15';
      case 'Ready':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/15 animate-pulse';
      case 'Served':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/15';
      case 'Preparing':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/15';
      case 'New':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/15';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/15';
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] overflow-hidden font-sans flex flex-col justify-between" id="billing-viewport">
      
      {/* Payment Success toast */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 bg-emerald-500 text-black px-5 py-3.5 rounded-xl font-bold flex items-center gap-2.5 shadow-2xl z-50 text-sm glow-green text-left max-w-md"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{paymentSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden" id="billing-splits">
        
        {/* Left Panel: Active Seating Tickets awaiting Checkout & Historical Ledger */}
        <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden" id="billing-left-panel">
          
          <div className="space-y-4 mb-4">
            {/* Elegant Header Tab Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setBillingTab('unbilled');
                    setSelectedOrderId(null);
                    setSettledSummary(null);
                  }}
                  className={`text-sm font-display font-extrabold uppercase tracking-wider pb-1 transition-all relative cursor-pointer ${
                    billingTab === 'unbilled' ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Unbilled Active Seating
                  {billingTab === 'unbilled' && (
                    <motion.div layoutId="billing-tab-accent" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setBillingTab('history');
                    setSelectedOrderId(null);
                    setSettledSummary(null);
                  }}
                  className={`text-sm font-display font-extrabold uppercase tracking-wider pb-1 transition-all relative cursor-pointer ${
                    billingTab === 'history' ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Order History Section
                  {billingTab === 'history' && (
                    <motion.div layoutId="billing-tab-accent" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
                  )}
                </button>
              </div>

              {/* Counter badges */}
              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-mono font-bold">
                {billingTab === 'unbilled' ? `${activeUnpaidOrders.length} Pending` : `${orders.length} Total`}
              </span>
            </div>

            {/* Sub-tabs horizontal strips if "Order History" is selected */}
            {billingTab === 'history' && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
              >
                {(['All', 'Paid', 'Active', 'Cancelled'] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setHistoryFilter(sub);
                      setSelectedOrderId(null);
                      setSettledSummary(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border ${
                      historyFilter === sub
                        ? 'bg-amber-500/10 border-gold-500/30 text-gold-500 shadow-md shadow-gold-500/5'
                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {sub} Tab
                  </button>
                ))}
              </motion.div>
            )}

            {/* Quick search input */}
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none w-4 h-4 my-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  billingTab === 'unbilled' 
                    ? "Search active tickets by order ID or table number..."
                    : "Search entire transaction database by order ID or table..."
                }
                className="w-full bg-[#121215] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
              />
            </div>
          </div>

          {/* List scroll */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 pb-4 scrollbar-none">
            {filteredList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 bg-white/[0.01] border border-white/[0.04] rounded-2xl py-12">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2 animate-bounce" />
                <p className="text-xs font-semibold text-white">No tickets found</p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  {billingTab === 'unbilled' 
                    ? "No unbilled order tickets currently outstanding in seating."
                    : `No records match the selected status filters or search query.`}
                </p>
              </div>
            ) : (
              filteredList.map((order) => {
                const isSelected = selectedOrderId === order.id;
                
                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setSettledSummary(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex items-center justify-between group relative ${
                      isSelected 
                        ? 'border-gold-500 bg-amber-500/[0.03] shadow-md shadow-gold-500/5' 
                        : 'border-white/[0.04] hover:border-white/10 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white font-bold text-xs">
                          Table {order.tableNumber}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{order.orderNumber}</span>
                        {order.status === 'Paid' && order.paymentMethod && (
                          <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>{order.paymentMethod}</span>
                          </span>
                        )}
                      </div>
                      
                      {/* Item descriptions */}
                      <p className="text-xs text-gray-400 font-sans max-w-md truncate">
                        Items: {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                      </p>

                      {/* Waiter & Timestamp info */}
                      <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        <span>Server: <strong className="text-gray-400 font-semibold">{order.waiterName || 'Staff'}</strong></span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-600" />
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1.5 shrink-0 flex flex-col items-end">
                      <p className="text-sm font-bold font-mono text-gold-500">${order.grandTotal.toFixed(2)}</p>
                      
                      {/* Fully styled Status badges */}
                      <span className={`inline-block text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-lg font-mono ${getStatusBadgeStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Simulated Thermal Receipt checkout */}
        <div className="lg:col-span-5 glass-card rounded-2xl flex flex-col justify-between overflow-hidden" id="billing-right-panel">
          
          <div className="p-4 border-b border-white/5 bg-[#121215] flex items-center justify-between text-left">
            {settledSummary ? (
              <div className="flex items-center gap-2 animate-pulse" style={{ animationDuration: '3s' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Transaction Settled</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-gold-500" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Terminal Checkout</span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-4 scrollbar-none" id="billing-terminal-body">
            {settledSummary ? (
              <motion.div
                variants={summaryContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 text-left h-full flex flex-col justify-center py-2"
                id="payment-success-summary"
              >
                {/* Header Checkmark */}
                <motion.div variants={summaryItemVariants} className="flex flex-col items-center text-center space-y-2 mb-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="w-7 h-7 animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                  </div>
                  <h4 className="text-base font-display font-extrabold text-emerald-400 uppercase tracking-wider mt-1">
                    Payment Successful
                  </h4>
                  <p className="text-[10px] text-gray-400">Order transaction finalized and logged to secure ledger</p>
                </motion.div>

                {/* Amount Settled */}
                <motion.div 
                  variants={summaryItemVariants} 
                  className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl p-4 text-center space-y-1 shadow-inner"
                >
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Amount Settled</p>
                  <p className="text-3xl font-mono font-bold text-white tracking-tight">
                    ${settledSummary.grandTotal.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>via {settledSummary.paymentMethod.toUpperCase()}</span>
                  </div>
                </motion.div>

                {/* Structured Breakdown Details */}
                <motion.div variants={summaryItemVariants} className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-gray-500">Receipt No:</span>
                    <span className="text-white font-bold">{settledSummary.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-gray-500">Table Number:</span>
                    <span className="text-white font-bold">Table {settledSummary.tableNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-gray-500">Service Server:</span>
                    <span className="text-gray-300 font-bold">{settledSummary.waiterName || 'Sarah Jenkins'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-gray-500">Items Ordered:</span>
                    <span className="text-gray-300">
                      {settledSummary.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Timestamp:</span>
                    <span className="text-gray-400 text-[10px]">
                      {new Date(settledSummary.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                </motion.div>

                {/* Small receipt miniature */}
                <motion.div 
                  variants={summaryItemVariants}
                  className="bg-white text-black/80 px-3 py-2 rounded-xl text-[9px] font-mono border border-gray-200/50 flex items-center justify-between shadow-sm italic"
                >
                  <span className="truncate pr-2 max-w-[200px]">
                    {settledSummary.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </span>
                  <span className="font-bold shrink-0 text-black">${settledSummary.subtotal.toFixed(2)} sub</span>
                </motion.div>
              </motion.div>
            ) : selectedOrder ? (
              <div className="space-y-4 text-left">
                
                {/* 1. THERMAL RECEIPT PREVIEW (Dashed high-fidelity style) */}
                <div className="bg-white text-black p-5 rounded-lg shadow-inner font-mono text-xs space-y-3 relative overflow-hidden" id="thermal-receipt">
                  
                  {/* Jagged paper top border decoration */}
                  <div className="absolute top-0 inset-x-0 h-1 flex justify-between overflow-hidden" style={{ opacity: 0.15 }}>
                    {Array.from({ length: 40 }).map((_, i) => (
                      <span key={i} className="w-2 h-2 bg-black rotate-45 shrink-0" style={{ transform: 'translateY(-4px)' }} />
                    ))}
                  </div>

                  {/* Stamp watermark overlay for PAID / CANCELLED transactions */}
                  {selectedOrder.status === 'Paid' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                      <div className="border-4 border-emerald-600 text-emerald-600 font-sans font-black text-2xl uppercase tracking-widest px-4 py-2 rounded-xl rotate-12 bg-white/95 shadow-xl shadow-emerald-500/10 scale-105">
                        PAID & SETTLED
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'Cancelled' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                      <div className="border-4 border-red-600 text-red-600 font-sans font-black text-2xl uppercase tracking-widest px-4 py-2 rounded-xl -rotate-12 bg-white/95 shadow-xl shadow-red-500/10 scale-105">
                        CANCELLED
                      </div>
                    </div>
                  )}

                  <div className="text-center space-y-1 pt-1.5">
                    <h5 className="font-bold text-sm tracking-tight">THE GILDED TRUFFLE BISTRO</h5>
                    <p className="text-[10px] text-gray-600">100 Luxury Promenade Blvd, CA</p>
                    <p className="text-[9px] text-gray-500">Tel: +1 (555) 777-8888</p>
                  </div>

                  {/* Dashed line */}
                  <div className="border-t border-dashed border-gray-400 my-2" />

                  {/* Meta details */}
                  <div className="text-[10px] space-y-0.5 text-gray-700">
                    <div className="flex justify-between">
                      <span>TICKET ID: {selectedOrder.orderNumber}</span>
                      <span>TABLE: {selectedOrder.tableNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SERVER: {selectedOrder.waiterName || 'SARAH JENKINS'}</span>
                      <span>TIME: {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Dashed line */}
                  <div className="border-t border-dashed border-gray-400 my-2" />

                  {/* Items list */}
                  <div className="space-y-1">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] leading-tight">
                        <span className="flex-1 truncate pr-2">
                          {item.name} <span className="text-gray-500">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dashed line */}
                  <div className="border-t border-dashed border-gray-400 my-2" />

                  {/* Financial computations */}
                  <div className="space-y-1 text-right text-[10px] text-gray-700 font-mono">
                    <div className="flex justify-between">
                      <span>SUBTOTAL:</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-amber-800">
                        <span>CAMPAIGN DISC ({selectedOrder.discount}%):</span>
                        <span>-${(selectedOrder.subtotal * selectedOrder.discount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>SALES TAX ({selectedOrder.tax}%):</span>
                      <span>${((selectedOrder.subtotal - (selectedOrder.subtotal * selectedOrder.discount / 100)) * selectedOrder.tax / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-black font-extrabold text-sm pt-1.5 border-t border-gray-300">
                      <span>GRAND TOTAL:</span>
                      <span>${selectedOrder.grandTotal.toFixed(2)}</span>
                    </div>

                    {/* Show payment details on receipt copy if paid */}
                    {selectedOrder.status === 'Paid' && (
                      <div className="flex justify-between text-emerald-800 font-bold border-t border-dashed border-gray-300 pt-1.5 mt-1">
                        <span>SETTLED VIA:</span>
                        <span>{selectedOrder.paymentMethod?.toUpperCase() || 'CARD'}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer message / QR */}
                  <div className="text-center pt-3.5 space-y-1.5 text-gray-500 text-[9px] relative z-0">
                    <div className="w-16 h-16 border-2 border-black border-dashed mx-auto flex items-center justify-center bg-gray-100 font-sans font-bold text-black uppercase">
                      QR CODE
                    </div>
                    <p className="font-sans italic">"THANK YOU FOR DINING WITH US!"</p>
                    <p className="font-sans font-semibold">Bistro Integrated Ledger</p>
                  </div>
                </div>

                {/* 2. PAYMENT METHODS SELECT PANEL */}
                <div className="space-y-2 text-left pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
                    <span>Method Selector</span>
                    {selectedOrder.status === 'Paid' && (
                      <span className="text-[9px] text-emerald-400 lowercase font-mono">
                        (locked: settled)
                      </span>
                    )}
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'Card', label: 'Card', icon: CreditCard },
                      { id: 'Cash', label: 'Cash', icon: Coins },
                      { id: 'UPI', label: 'UPI', icon: Smartphone },
                      { id: 'Wallet', label: 'Wallet', icon: Wallet },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isOrderPaid = selectedOrder.status === 'Paid';
                      const isActive = isOrderPaid
                        ? selectedOrder.paymentMethod === m.id
                        : paymentMethod === m.id;
                      
                      return (
                        <button
                          key={m.id}
                          type="button"
                          disabled={isOrderPaid}
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs ${
                            isActive
                              ? 'bg-amber-500/10 border-gold-500 text-gold-500 font-bold'
                              : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                          } ${isOrderPaid ? 'cursor-default opacity-85' : 'cursor-pointer'}`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-[9px]">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-12">
                <Receipt className="w-10 h-10 text-gray-600 mb-3 animate-pulse" />
                <p className="text-xs font-medium">No Ticket Selected.</p>
                <p className="text-[10px] text-gray-600 mt-1 max-w-xs">
                  {billingTab === 'unbilled'
                    ? "Select any outstanding table order on the left to initiate settlement, review invoices, and checkout guests."
                    : "Select any historical order on the left to inspect logs, view original invoices, or print duplicate receipts."}
                </p>
              </div>
            )}
          </div>

          {/* Action settlement panel */}
          <div className="p-4 border-t border-white/5 bg-[#121215]" id="billing-checkout-actions">
            {settledSummary ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrintDuplicateFromSummary}
                  disabled={isPrinting}
                  className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 flex items-center justify-center gap-1.5 cursor-pointer animate-fade-in"
                >
                  <Printer className="w-4 h-4 text-gold-500" />
                  <span>{isPrinting ? 'Printing...' : 'Print Duplicate'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettledSummary(null)}
                  className="py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer uppercase tracking-wider"
                >
                  <Check className="w-4 h-4" />
                  <span>Next Ticket</span>
                </button>
              </div>
            ) : selectedOrder ? (
              selectedOrder.status === 'Paid' ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePrintInvoice}
                    disabled={isPrinting}
                    className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isPrinting ? 'Printing...' : 'Duplicate Copy'}</span>
                  </button>

                  <div className="py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg select-none uppercase tracking-wider">
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Ledger Settled</span>
                  </div>
                </div>
              ) : selectedOrder.status === 'Cancelled' ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled
                    className="py-3 bg-white/5 opacity-50 border border-white/10 rounded-xl text-xs font-semibold text-gray-500 flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Bill</span>
                  </button>

                  <div className="py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg select-none uppercase tracking-wider">
                    <Ban className="w-4 h-4" />
                    <span>Cancelled</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePrintInvoice}
                    disabled={isPrinting || isPaying}
                    className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isPrinting ? 'Printing...' : 'Print Bill'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCollectPayment}
                    disabled={isPaying || isPrinting}
                    className="py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer uppercase tracking-wider"
                  >
                    {isPaying ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Settling...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Collect Bill</span>
                      </>
                    )}
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 p-3 bg-black/25 rounded-xl">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <span>Select an active bill above to process payment.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
