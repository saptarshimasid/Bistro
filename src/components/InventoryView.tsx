import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus, 
  Truck, 
  Calendar, 
  Check, 
  Wrench, 
  Info,
  RefreshCw,
  Download,
  Printer,
  Share2,
  FileText,
  Copy,
  X
} from 'lucide-react';
import { InventoryItem } from '../types';
import { jsPDF } from 'jspdf';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onRestockItem: (itemId: string, amount: number) => void;
  onAddInventoryItem: (item: InventoryItem) => void;
  themeStyle: 'gold' | 'platinum';
}

export default function InventoryView({
  inventory,
  onRestockItem,
  onAddInventoryItem,
  themeStyle
}: InventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Meats' | 'Seafood' | 'Produce' | 'Dairy' | 'Dry Goods' | 'Oils & Condiments' | 'Spices'>('All');
  
  // Create item modal controller
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Produce');
  const [currentStock, setCurrentStock] = useState(10);
  const [minimumStock, setMinimumStock] = useState(5);
  const [unit, setUnit] = useState('kg');
  const [supplier, setSupplier] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Handle restock prompt click
  const handleQuickRestock = (item: InventoryItem) => {
    // Automatically restock by a healthy volume without prompts or alerts
    const needed = item.minimumStock * 2 - item.currentStock;
    const amountNum = Math.max(10, Math.round(needed * 10) / 10);
    onRestockItem(item.id, amountNum);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !supplier) {
      alert('Please fill in all ingredient fields.');
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newItem: InventoryItem = {
      id: `i_${Date.now()}_${randomSuffix}`,
      name,
      category,
      currentStock,
      minimumStock,
      unit,
      supplier,
      expiryDate
    };

    onAddInventoryItem(newItem);
    
    // Reset Form
    setName('');
    setSupplier('');
    setCurrentStock(10);
    setMinimumStock(5);
    setUnit('kg');
    setShowAddModal(false);
  };

  const generatePDFBlob = (): Blob => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const isGold = themeStyle === 'gold';
    const accentRGB = isGold ? [212, 175, 55] : [34, 211, 238]; // #d4af37 (Gold) vs #22d3ee (Cyan)
    
    // Top colored block
    doc.setFillColor(18, 18, 21);
    doc.rect(0, 0, 210, 40, 'F');

    // Colored ribbon line
    doc.setFillColor(accentRGB[0], accentRGB[1], accentRGB[2]);
    doc.rect(0, 39, 210, 1.5, 'F');

    // White Title text inside top banner
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('DELIFLOW GASTRONOMY', 15, 18);

    // Subtitle inside top banner
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(accentRGB[0], accentRGB[1], accentRGB[2]);
    doc.text('PREMIUM RESTAURANT OPERATING LEDGER', 15, 25);

    // Meta-timestamp inside top banner
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    const dateFormatted = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
    doc.text(`Report Issued: ${dateFormatted}  |  Restock Classification: Urgent`, 15, 32);

    // Core Title of the Report
    doc.setTextColor(18, 18, 21);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('LOW-STOCK INGREDIENTS STATUS REPORT', 15, 54);

    // Mini descriptive paragraph
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Automated tracking logs indicating active items that have depleted past their defined safe operating threshold.', 15, 60);

    // Decorative divider line
    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.3);
    doc.line(15, 64, 195, 64);

    // Low stock filter
    const targetItems = inventory.filter(item => item.currentStock <= item.minimumStock);

    let currentY = 74;

    if (targetItems.length === 0) {
      // Nominal state (no depleted items)
      doc.setFillColor(240, 253, 244); // light green background
      doc.rect(15, currentY, 180, 24, 'F');
      
      doc.setTextColor(22, 101, 52); // dark green
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('✓ ALL STORES SECURE', 20, currentY + 9);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text('Every cataloged raw ingredient is currently operating safely above set warning limit parameters.', 20, currentY + 16);
      currentY += 34;
    } else {
      // Headers of custom table
      doc.setFillColor(244, 244, 246);
      doc.rect(15, currentY, 180, 8, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text('Ingredient Details', 18, currentY + 5.5);
      doc.text('Category', 72, currentY + 5.5);
      doc.text('Available', 105, currentY + 5.5);
      doc.text('Limit Bar', 130, currentY + 5.5);
      doc.text('Registered Supplier', 155, currentY + 5.5);

      currentY += 8;

      // Table body rows
      targetItems.forEach((item, idx) => {
        // Alternating background stripes
        if (idx % 2 === 1) {
          doc.setFillColor(250, 250, 252);
          doc.rect(15, currentY, 180, 8, 'F');
        }

        // Row division line
        doc.setDrawColor(240, 240, 242);
        doc.line(15, currentY + 8, 195, currentY + 8);

        const rowY = currentY + 5.5;
        
        // Item name (Bold, high contrast)
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(18, 18, 21);
        doc.text(item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name, 18, rowY);

        // Category
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(item.category, 72, rowY);

        // Current stock (highlighted in red)
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text(`${item.currentStock} ${item.unit}`, 105, rowY);

        // Safety minimum stock
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text(`${item.minimumStock} ${item.unit}`, 130, rowY);

        // Supplier name
        doc.setTextColor(80, 80, 80);
        doc.text(item.supplier.length > 18 ? item.supplier.substring(0, 18) + '...' : item.supplier, 155, rowY);

        currentY += 8;
      });

      currentY += 12;
    }

    // Check if drawing authorization footer overflows the current page
    if (currentY > 240) {
      doc.addPage();
      currentY = 30;
    }

    // Authorization sign-off segment
    doc.setDrawColor(220, 224, 228);
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(18, 18, 21);
    doc.text('PROCUREMENT AND STOCK REPLENISHMENT DIRECTIVE', 15, currentY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('I hereby authorize immediate purchase orders for the depleted resources compiled on this sheet.', 15, currentY + 13);
    doc.text('Repurchased volumes must meet quality benchmarks to prevent menu interruptions.', 15, currentY + 17);

    // Visual signature placeholders
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(15, currentY + 36, 85, currentY + 36);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Signature of Kitchen Manager', 15, currentY + 41);

    doc.line(115, currentY + 36, 185, currentY + 36);
    doc.text('Date of Authorization Approval', 115, currentY + 41);

    // Confidentiality footer banner
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 160);
    doc.text('Deliflow Premium Systems • Confidential Business Intelligence Operations Ledger', 15, 285);
    doc.text('Page 1 of 1', 183, 285);

    return doc.output('blob');
  };

  const handleDownloadPDF = () => {
    try {
      const blob = generatePDFBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `deliflow_low_stock_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating or downloading PDF report:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handlePrintPDF = () => {
    try {
      const blob = generatePDFBlob();
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        };
      }
    } catch (error) {
      console.error('Error opening print preview:', error);
      alert('Failed to initialize browser print routine.');
    }
  };

  const handleShareReport = () => {
    try {
      const targetItems = inventory.filter(item => item.currentStock <= item.minimumStock);
      if (targetItems.length === 0) {
        navigator.clipboard.writeText(`🍽️ DELIFLOW STOCK LEDGER 🍽️\nAll ingredients are healthy and safely above their min limits. No low-stock alerts detected!`);
      } else {
        const lines = targetItems.map(
          item => `• [${item.category}] ${item.name}: Current ${item.currentStock} ${item.unit} (Safety margin: ${item.minimumStock} ${item.unit}) | Supplier: ${item.supplier}`
        );
        const copyStr = `⚠️ DELIFLOW CRITICAL LOW-STOCK REPORT ⚠️\n\nGenerated: ${new Date().toLocaleString()}\nCritical Items to Replenish:\n${lines.join('\n')}\n\nPlease issue procurement authorization orders immediately.`;
        navigator.clipboard.writeText(copyStr);
      }
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (error) {
      console.error('Failed to copy summary:', error);
      alert('Failed to copy summary to clipboard.');
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItemsCount = inventory.length;
  const lowStockCount = inventory.filter((item) => item.currentStock <= item.minimumStock).length;
  const criticalItems = inventory.filter((item) => item.currentStock <= item.minimumStock);

  return (
    <div className="p-6 space-y-6 font-sans text-left">
      
      {/* 1. Low stock warnings flashing board */}
      {lowStockCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl glow-red flex items-start gap-3.5 text-red-400"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 animate-pulse mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-sm">Critical Ingredient Alarms Flashing!</h5>
            <p className="text-xs text-red-400/85">
              {lowStockCount} ingredient{lowStockCount > 1 ? 's are' : ' is'} below the safety threshold. Kitchen preparations could face interruption. Restock immediate supply.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {criticalItems.map((item) => (
                <span key={item.id} className="text-[10px] font-mono font-bold bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded text-red-400">
                  {item.name} ({item.currentStock} {item.unit} left)
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Top Metric Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5" id="inventory-stats">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Raw Ingredients Tracked</span>
          <p className="text-xl font-bold text-white font-mono">{totalItemsCount} items</p>
        </div>
        <div className="glass-card p-4 rounded-xl border-red-500/10">
          <span className="text-[10px] text-red-500 uppercase font-bold">Depleted / Low Stock</span>
          <p className="text-xl font-bold text-red-400 font-mono">{lowStockCount} alarms</p>
        </div>
        <div className="glass-card p-4 rounded-xl border-emerald-500/10">
          <span className="text-[10px] text-emerald-500 uppercase font-bold">Nominal Stock Volume</span>
          <p className="text-xl font-bold text-emerald-400 font-mono">{totalItemsCount - lowStockCount} items</p>
        </div>
        <div className="glass-card p-4 rounded-xl border-blue-500/10">
          <span className="text-[10px] text-blue-500 uppercase font-bold">Active Suppliers</span>
          <p className="text-xl font-bold text-blue-400 font-mono">6 partners</p>
        </div>
      </div>

      {/* 3. Controls and filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4" id="inventory-filters">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none w-4 h-4 my-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search raw ingredients by supplier..."
              className="w-full bg-[#121215] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs text-white"
            />
          </div>

          {/* Categories select */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full sm:w-auto bg-[#0e0e11] border border-white/10 rounded-xl py-2 px-3 text-xs text-white cursor-pointer focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Meats">Meats</option>
            <option value="Seafood">Seafood</option>
            <option value="Produce">Produce</option>
            <option value="Dairy">Dairy</option>
            <option value="Dry Goods">Dry Goods</option>
            <option value="Oils & Condiments">Oils & Condiments</option>
            <option value="Spices">Spices</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {/* Low stock export hub trigger */}
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            title="Generate formatted PDF of low-stock ingredients"
            id="export-pdf-hub-btn"
          >
            <FileText className="w-4 h-4 text-gold-500" />
            <span>Low-Stock PDF Export</span>
          </button>

          {/* Add ingredient button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Raw Stock</span>
          </button>
        </div>
      </div>

      {/* 4. Inventory Data list */}
      <div className="glass-card rounded-2xl overflow-hidden" id="inventory-table-wrapper">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left border-collapse">
            <thead>
              <tr className="bg-[#121215] border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="p-4">Ingredient Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Safety Margin</th>
                <th className="p-4">Supplier Partner</th>
                <th className="p-4">Expiration Date</th>
                <th className="p-4 text-center">Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent text-xs text-gray-300">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-35" />
                    <span>No raw ingredients matching search filter.</span>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.currentStock <= item.minimumStock;
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-white/[0.01] transition-colors ${
                        isLow ? 'bg-red-500/[0.01]' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{item.name}</span>
                          {isLow && (
                            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-0.5 animate-pulse flex items-center gap-1 font-mono">
                              ⚠️ Depleted stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="bg-white/5 border border-white/10 text-gray-400 font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold">
                          {item.category}
                        </span>
                      </td>

                      {/* Current Stock */}
                      <td className="p-4">
                        <span className={`font-mono text-sm font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>
                          {item.currentStock} {item.unit}
                        </span>
                      </td>

                      {/* Minimum Stock */}
                      <td className="p-4">
                        <span className="font-mono text-gray-500 text-xs">
                          {item.minimumStock} {item.unit} safety
                        </span>
                      </td>

                      {/* Supplier */}
                      <td className="p-4">
                        <span className="text-gray-400 font-medium flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-gold-500" />
                          {item.supplier}
                        </span>
                      </td>

                      {/* Expiration date */}
                      <td className="p-4">
                        <span className="font-mono text-gray-500 text-[10px] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-600" />
                          {item.expiryDate}
                        </span>
                      </td>

                      {/* Restock trigger */}
                      <td className="p-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleQuickRestock(item)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 border ${
                              isLow 
                                ? 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20' 
                                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                            }`}
                          >
                            <RefreshCw className="w-3 h-3 shrink-0" />
                            <span>Quick Restock</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Register item modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-card p-6 rounded-2xl relative text-left glow-gold"
              id="add-inventory-modal"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Register Raw Ingredient</h3>
                  <p className="text-xs text-gray-400 font-sans">Enlist new supplier delivery details</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-4">
                {/* Ingredient Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ingredient Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white"
                    placeholder="e.g. Organic Black Garlic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#0e0e11] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-2 text-xs text-white cursor-pointer"
                    >
                      <option value="Meats">Meats</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Produce">Produce</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Dry Goods">Dry Goods</option>
                      <option value="Oils & Condiments">Oils & Condiments</option>
                      <option value="Spices">Spices</option>
                    </select>
                  </div>

                  {/* Unit */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Unit metric</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
                      placeholder="e.g. kg, liters, units"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Current stock */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Current stock</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={currentStock}
                      onChange={(e) => setCurrentStock(parseFloat(e.target.value))}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3 text-xs text-white font-mono"
                      placeholder="10"
                    />
                  </div>

                  {/* Min stock */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Safety margin</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={minimumStock}
                      onChange={(e) => setMinimumStock(parseFloat(e.target.value))}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3 text-xs text-white font-mono"
                      placeholder="5"
                    />
                  </div>
                </div>

                {/* Supplier partner */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Supplier Partner Name</label>
                  <input
                    type="text"
                    required
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white"
                    placeholder="Miyazaki Gourmet Co."
                  />
                </div>

                {/* Expiration date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Expiration date warning</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3 text-xs text-white font-mono"
                  />
                </div>

                {/* Submit panel */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-gold-500/10 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Seat Stock</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showExportModal && (
          <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl relative text-left glow-gold max-h-[90vh] overflow-y-auto"
              id="low-stock-export-modal"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold-500" />
                    <span>Low-Stock Report Hub</span>
                  </h3>
                  <p className="text-xs text-gray-400">Generate, print, or share formatted inventory reports</p>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body summary preview */}
              <div className="space-y-5">
                {/* Visual miniature printout card */}
                <div className="bg-[#121215] border border-white/5 rounded-xl p-4 space-y-3.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Miniature header bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                    <span className="text-gold-500 font-extrabold tracking-wider">DELIFLOW GASTRONOMY</span>
                    <span className="text-gray-500">{new Date().toLocaleDateString()}</span>
                  </div>

                  {/* Summary Overview Blocks */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg text-left">
                      <span className="text-[9px] text-gray-500 font-mono block uppercase">Alerts Found</span>
                      <strong className="text-sm font-mono text-white block mt-0.5">{lowStockCount} items</strong>
                    </div>
                    <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg text-left">
                      <span className="text-[9px] text-gray-500 font-mono block uppercase">Action Needed</span>
                      <strong className="text-sm font-mono text-red-400 block mt-0.5">Replenish Immediately</strong>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-gray-500 font-mono block uppercase">Ingredient List Preview:</span>
                    <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 scrollbar-none">
                      {inventory.filter(item => item.currentStock <= item.minimumStock).length === 0 ? (
                        <div className="text-center py-4 text-emerald-400 text-xs font-mono">
                          ✓ All ingredients nominal. 0 items low.
                        </div>
                      ) : (
                        inventory
                          .filter(item => item.currentStock <= item.minimumStock)
                          .map((item) => (
                            <div 
                              key={item.id} 
                              className="flex items-center justify-between text-xs font-mono bg-white/[0.01] border border-white/[0.03] p-2 rounded"
                            >
                              <div className="truncate pr-2 text-left">
                                <span className="text-gray-200 font-bold block truncate">{item.name}</span>
                                <span className="text-[9px] text-gray-500">{item.supplier}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-red-400 font-bold">{item.currentStock} {item.unit}</span>
                                <span className="text-[9px] text-gray-500 block">Min: {item.minimumStock}</span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed text-left">
                  This export utility uses a modern high-contrast PDF design styled with your active brand accents ({themeStyle}). The document complies with commercial kitchen ledgers, featuring professional metadata headers and authorization sign-offs.
                </p>

                {/* Grid of Action CTA buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="py-3 px-4 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shadow-gold-500/5 hover:brightness-110 uppercase tracking-wider text-center"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintPDF}
                    className="py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center font-mono"
                  >
                    <Printer className="w-4 h-4 text-gold-500 shrink-0" />
                    <span>Print PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareReport}
                    className={`py-3 px-4 border text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 text-center font-mono ${
                      copiedText
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Copied Summary!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-gold-500 shrink-0" />
                        <span>Share Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
