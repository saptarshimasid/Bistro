import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  HelpCircle, 
  RefreshCw, 
  Check, 
  Clock, 
  UserPlus, 
  ShieldAlert, 
  UtensilsCrossed,
  Info,
  Flame,
  BarChart3
} from 'lucide-react';
import { Table, TableStatus } from '../types';

interface TableManagementViewProps {
  tables: Table[];
  onUpdateTable: (tableId: string, updates: Partial<Table>) => void;
  onSelectTableForOrder: (tableNumber: number) => void;
  themeStyle: 'gold' | 'platinum';
}

export default function TableManagementView({
  tables,
  onUpdateTable,
  onSelectTableForOrder,
  themeStyle
}: TableManagementViewProps) {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [filter, setFilter] = useState<TableStatus | 'All'>('All');
  
  // Heatmap states & helpers
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ tableNum: number; hour: number; density: number } | null>(null);

  const hoursOfDay = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  const formatHour = (h: number) => {
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  // Deterministic daily occupancy generator for heatmap
  const getTableHourlyDensity = (tableNum: number, hour: number) => {
    let base = 15; // baseline occupancy %
    if (hour >= 12 && hour <= 14) {
      base += 50;
    } else if (hour >= 18 && hour <= 21) {
      base += 70;
    } else if (hour >= 15 && hour <= 17) {
      base += 20;
    }
    
    const multiplier = (tableNum % 3 === 0) ? 0.8 : (tableNum % 2 === 0) ? 1.15 : 0.95;
    return Math.min(100, Math.max(5, Math.round(base * multiplier)));
  };

  const getTableDailyAverage = (tableNum: number) => {
    const sum = hoursOfDay.reduce((acc, h) => acc + getTableHourlyDensity(tableNum, h), 0);
    return Math.round(sum / hoursOfDay.length);
  };

  const getDensityColor = (density: number) => {
    if (density < 30) {
      return {
        bg: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20',
        text: 'text-emerald-400',
        label: 'Low',
        color: '#10b981',
      };
    } else if (density < 45) {
      return {
        bg: 'bg-green-950/40 text-green-400 border-green-500/20',
        text: 'text-green-400',
        label: 'Moderate',
        color: '#4ade80',
      };
    } else if (density < 60) {
      return {
        bg: 'bg-yellow-950/40 text-yellow-400 border-yellow-500/20',
        text: 'text-yellow-400',
        label: 'Medium',
        color: '#eab308',
      };
    } else if (density < 75) {
      return {
        bg: 'bg-orange-950/40 text-orange-400 border-orange-500/20',
        text: 'text-orange-400',
        label: 'High',
        color: '#f97316',
      };
    } else {
      return {
        bg: 'bg-red-950/40 text-red-400 border-red-500/20',
        text: 'text-red-400',
        label: 'Peak',
        color: '#ef4444',
      };
    }
  };

  const getHeatmapCardStyle = (avgDensity: number) => {
    if (avgDensity < 30) {
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/30',
        indicator: 'bg-emerald-500',
        barBg: 'bg-emerald-500',
      };
    } else if (avgDensity < 45) {
      return {
        bg: 'bg-green-500/10 border-green-500/20 text-green-400',
        glow: 'shadow-[0_0_20px_rgba(74,222,128,0.15)] border-green-500/30',
        indicator: 'bg-green-400',
        barBg: 'bg-green-400',
      };
    } else if (avgDensity < 60) {
      return {
        bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)] border-yellow-500/30',
        indicator: 'bg-yellow-500',
        barBg: 'bg-yellow-500',
      };
    } else if (avgDensity < 75) {
      return {
        bg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        glow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)] border-orange-500/30',
        indicator: 'bg-orange-500',
        barBg: 'bg-orange-500',
      };
    } else {
      return {
        bg: 'bg-red-500/10 border-red-500/20 text-red-400',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)] border-red-500/30',
        indicator: 'bg-red-500',
        barBg: 'bg-red-500',
      };
    }
  };
  
  // Form edit states
  const [editStatus, setEditStatus] = useState<TableStatus>('Available');
  const [editCustomer, setEditCustomer] = useState('');
  const [editGuests, setEditGuests] = useState(2);

  const selectedTable = tables.find(t => t.id === selectedTableId);

  const handleTableClick = (t: Table) => {
    setSelectedTableId(t.id);
    setEditStatus(t.status);
    setEditCustomer(t.customerName || '');
    setEditGuests(t.guestsCount || 2);
  };

  const handleSaveChanges = () => {
    if (!selectedTableId) return;
    
    const updates: Partial<Table> = {
      status: editStatus,
      customerName: editStatus === 'Occupied' || editStatus === 'Reserved' ? editCustomer : undefined,
      guestsCount: editStatus === 'Occupied' || editStatus === 'Reserved' ? editGuests : undefined,
    };

    onUpdateTable(selectedTableId, updates);
    setSelectedTableId(null);
  };

  // Status badges mapping
  const getStatusStyle = (status: TableStatus) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/30',
          indicator: 'bg-emerald-500'
        };
      case 'Occupied':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)] border-amber-500/40',
          indicator: 'bg-amber-500'
        };
      case 'Reserved':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)] border-blue-500/30',
          indicator: 'bg-blue-500'
        };
      case 'Cleaning':
        return {
          bg: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400',
          glow: 'shadow-[0_0_20px_rgba(217,70,239,0.15)] border-fuchsia-500/30',
          indicator: 'bg-fuchsia-500'
        };
    }
  };

  // Seating Capacity Stats
  const totalTablesCount = tables.length;
  const vacantCount = tables.filter(t => t.status === 'Available').length;
  const occupiedCount = tables.filter(t => t.status === 'Occupied').length;
  const reservedCount = tables.filter(t => t.status === 'Reserved').length;
  const cleaningCount = tables.filter(t => t.status === 'Cleaning').length;

  const filteredTables = filter === 'All' 
    ? tables 
    : tables.filter(t => t.status === filter);

  return (
    <div className="p-6 space-y-6 font-sans">
      
      {/* 1. Statistics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="table-overview-bar">
        <div className="glass-card p-3.5 rounded-xl text-left">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Total Tables</span>
          <p className="text-xl font-bold text-white font-mono">{totalTablesCount}</p>
        </div>
        <div className="glass-card p-3.5 rounded-xl text-left border-emerald-500/10">
          <span className="text-[10px] text-emerald-500 uppercase font-bold">Available</span>
          <p className="text-xl font-bold text-emerald-400 font-mono">{vacantCount}</p>
        </div>
        <div className="glass-card p-3.5 rounded-xl text-left border-amber-500/10">
          <span className="text-[10px] text-amber-500 uppercase font-bold">Occupied</span>
          <p className="text-xl font-bold text-amber-400 font-mono">{occupiedCount}</p>
        </div>
        <div className="glass-card p-3.5 rounded-xl text-left border-blue-500/10">
          <span className="text-[10px] text-blue-500 uppercase font-bold">Reserved</span>
          <p className="text-xl font-bold text-blue-400 font-mono">{reservedCount}</p>
        </div>
        <div className="glass-card p-3.5 rounded-xl text-left border-fuchsia-500/10 col-span-2 md:col-span-1">
          <span className="text-[10px] text-fuchsia-500 uppercase font-bold">Cleaning</span>
          <p className="text-xl font-bold text-fuchsia-400 font-mono">{cleaningCount}</p>
        </div>
      </div>

      {/* 1.5 Table Occupancy Heatmap Component */}
      <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-4 text-left relative overflow-hidden" id="table-occupancy-heatmap">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 border border-gold-500/20 rounded-lg text-gold-500">
                <Flame className="w-4 h-4 animate-pulse" />
              </span>
              <h3 className="font-display font-bold text-base text-white">Table Occupancy Heatmap</h3>
            </div>
            <p className="text-xs text-gray-400">
              Interactive hourly usage density patterns over the course of the current day.
            </p>
          </div>

          {/* Interactive controls & legend */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Heatmap Floor Plan Overlay Toggle */}
            <button
              onClick={() => setShowHeatmapOverlay(!showHeatmapOverlay)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                showHeatmapOverlay
                  ? 'bg-amber-500/15 border-gold-500/40 text-gold-500 shadow-lg shadow-gold-500/5'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showHeatmapOverlay ? 'bg-gold-500 animate-ping' : 'bg-gray-500'}`} />
              <span>{showHeatmapOverlay ? 'Disable Heatmap Overlay' : 'Enable Heatmap Overlay'}</span>
            </button>

            {/* Gradient Color Scale Legend */}
            <div className="flex items-center gap-1.5 bg-white/[0.01] border border-white/5 rounded-xl px-2.5 py-1 text-[10px] font-mono text-gray-400">
              <span className="text-gray-500 uppercase font-semibold mr-1">Scale:</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/20" title="Low: <30%" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-green-400/30 border border-green-500/20" title="Moderate: 30-45%" />
                <span>Mod</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-yellow-500/30 border border-yellow-500/20" title="Medium: 45-60%" />
                <span>Med</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-orange-500/35 border border-orange-500/20" title="High: 60-75%" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-red-500/40 border border-red-500/20" title="Peak: >75%" />
                <span>Peak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Grid Layout */}
        <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10">
          <div className="min-w-[768px] space-y-1.5">
            {/* Header Timeline Columns */}
            <div 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
              className="gap-1.5 items-center text-[10px] uppercase font-mono font-bold tracking-wider text-gray-500 border-b border-white/5 pb-2"
            >
              <div className="col-span-2 text-left">Table / Pax</div>
              {hoursOfDay.map((h) => (
                <div key={h} className="text-center">{formatHour(h)}</div>
              ))}
              <div className="text-right">Daily Avg</div>
            </div>

            {/* Table Rows */}
            {tables.map((table) => {
              const dailyAvg = getTableDailyAverage(table.number);
              const avgStyle = getHeatmapCardStyle(dailyAvg);

              return (
                <div 
                  key={table.id}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
                  className="gap-1.5 items-center bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 p-2 rounded-xl transition-all"
                >
                  {/* Table details (2 cols) */}
                  <div className="col-span-2 flex items-center justify-between text-left pr-2 border-r border-white/5">
                    <span className="font-display font-extrabold text-sm text-white">T-{table.number}</span>
                    <span className="text-[10px] font-mono text-gray-500">Cap: {table.capacity}</span>
                  </div>

                  {/* Hourly cells (12 cols) */}
                  {hoursOfDay.map((hour) => {
                    const density = getTableHourlyDensity(table.number, hour);
                    const cellStyle = getDensityColor(density);
                    const isHovered = hoveredCell?.tableNum === table.number && hoveredCell?.hour === hour;

                    return (
                      <div
                        key={hour}
                        onMouseEnter={() => setHoveredCell({ tableNum: table.number, hour, density })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`relative aspect-square sm:h-9 flex flex-col items-center justify-center rounded-lg border text-[10px] font-mono font-bold transition-all cursor-crosshair ${cellStyle.bg} ${
                          isHovered ? 'scale-110 border-white/40 ring-2 ring-gold-500/20 z-10' : ''
                        }`}
                      >
                        {density}%
                      </div>
                    );
                  })}

                  {/* Daily Average Cell (1 col) */}
                  <div className="text-right pl-2 border-l border-white/5">
                    <span className={`inline-block text-[10px] font-mono font-bold px-2 py-1 rounded-md ${avgStyle.bg}`}>
                      {dailyAvg}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hover info / Tooltip Area */}
        <div className="min-h-6 flex items-center justify-between text-xs text-gray-400 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-1.5">
          {hoveredCell ? (
            <div className="flex items-center gap-2 text-left">
              <span className="font-semibold text-white">Table T-{hoveredCell.tableNum}</span>
              <span className="text-gray-500">•</span>
              <span>Time: <strong className="text-gray-300 font-mono">{formatHour(hoveredCell.hour)}</strong></span>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-1.5">
                Density: 
                <strong className={`font-mono ${getDensityColor(hoveredCell.density).text}`}>
                  {hoveredCell.density}%
                </strong>
                <span className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: getDensityColor(hoveredCell.density).color }} />
                <span className="text-[10px] uppercase tracking-wider text-gray-500">({getDensityColor(hoveredCell.density).label})</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-500 text-left">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Hover over any cell to inspect granular hourly statistics.</span>
            </div>
          )}
          
          <div className="text-[10px] font-mono text-gray-500 hidden sm:block">
            Updated today: {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* 2. Seating Map Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="table-filters-container">
        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 bg-white/[0.02] p-1.5 border border-white/5 rounded-xl">
          {(['All', 'Available', 'Occupied', 'Reserved', 'Cleaning'] as const).map((opt) => {
            const isActive = filter === opt;
            return (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-black shadow' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-3 py-2 rounded-xl">
          <Info className="w-3.5 h-3.5 text-gold-500" />
          <span>Click on any table card to seated guests or execute statuses change.</span>
        </div>
      </div>

      {/* 3. Physical Floor Plan Seating Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4" id="table-floor-grid">
        {filteredTables.map((table) => {
          const dailyAvg = getTableDailyAverage(table.number);
          const heatStyle = getHeatmapCardStyle(dailyAvg);
          const styles = showHeatmapOverlay ? heatStyle : getStatusStyle(table.status);
          const isSelected = selectedTableId === table.id;
          
          return (
            <motion.div
              key={table.id}
              layoutId={`table-card-${table.id}`}
              onClick={() => handleTableClick(table)}
              whileHover={{ scale: 1.03 }}
              className={`p-5 rounded-2xl glass-card transition-all cursor-pointer relative flex flex-col justify-between h-40 text-left ${
                isSelected ? 'border-gold-500 ' + styles.glow : styles.glow
              }`}
            >
              {/* Table Number Circular Ring */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-gray-500">
                  Bay Seating
                </span>
                
                <span className={`w-2 h-2 rounded-full ${styles.indicator}`} />
              </div>

              {/* Central Table Identity */}
              <div className="my-2 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <h3 className="font-display font-extrabold text-3xl text-white">
                    T-{table.number}
                  </h3>
                  <span className="text-xs text-gray-500 font-mono">({table.capacity} Pax)</span>
                </div>
                
                {/* Status Indicator text */}
                <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border font-mono ${styles.bg}`}>
                  {showHeatmapOverlay ? `Avg Use: ${dailyAvg}%` : table.status}
                </span>
              </div>

              {/* Seated customer info */}
              <div className="text-[11px] truncate flex items-center gap-1 text-gray-400">
                {showHeatmapOverlay ? (
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${heatStyle.barBg}`} style={{ width: `${dailyAvg}%` }} />
                    </div>
                    <span className="font-mono font-bold text-gray-300 shrink-0 text-[10px]">{dailyAvg}% Density</span>
                  </div>
                ) : (
                  <>
                    {table.status === 'Occupied' && (
                      <>
                        <Users className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="font-sans truncate font-medium text-gray-300">{table.customerName || 'Walk-In'}</span>
                      </>
                    )}
                    {table.status === 'Reserved' && (
                      <>
                        <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="font-sans truncate font-medium text-gray-300">{table.customerName || 'Booking'}</span>
                      </>
                    )}
                    {table.status === 'Cleaning' && (
                      <span className="font-mono text-fuchsia-400 animate-pulse font-semibold">Sanitizing...</span>
                    )}
                    {table.status === 'Available' && (
                      <span className="font-mono text-emerald-500/75">Ready to Seat</span>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 4. Table Detail Modal / Sidebar Overlay */}
      <AnimatePresence>
        {selectedTableId && selectedTable && (
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-card p-6 rounded-2xl relative text-left glow-gold"
              id="table-modal"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Table {selectedTable.number} Details</h3>
                  <p className="text-xs text-gray-400">Capacity limit: {selectedTable.capacity} guests maximum</p>
                </div>
                <button
                  onClick={() => setSelectedTableId(null)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Switcher */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Current Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Available', 'Occupied', 'Reserved', 'Cleaning'] as TableStatus[]).map((statusOption) => (
                      <button
                        key={statusOption}
                        type="button"
                        onClick={() => {
                          setEditStatus(statusOption);
                          if (statusOption === 'Available' || statusOption === 'Cleaning') {
                            setEditCustomer('');
                          }
                        }}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                          editStatus === statusOption
                            ? 'bg-amber-500/10 border-gold-500 text-gold-500'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional parameters if occupied or reserved */}
                {(editStatus === 'Occupied' || editStatus === 'Reserved') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-1"
                  >
                    {/* Customer Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {editStatus === 'Occupied' ? 'Guest Name / Walk-In Title' : 'Reservation Name'}
                      </label>
                      <input
                        type="text"
                        value={editCustomer}
                        onChange={(e) => setEditCustomer(e.target.value)}
                        className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white"
                        placeholder={editStatus === 'Occupied' ? 'Sophia Loren or Table Walk-In' : 'Marcus Aurelius'}
                      />
                    </div>

                    {/* Guests Count */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Head Count (Pax)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max={selectedTable.capacity + 2}
                          value={editGuests}
                          onChange={(e) => setEditGuests(parseInt(e.target.value))}
                          className="flex-1 accent-gold-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                        <span className="text-sm font-mono font-bold text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                          {editGuests} Guests
                        </span>
                      </div>
                      {editGuests > selectedTable.capacity && (
                        <div className="flex items-center gap-1 text-amber-500 text-[10px] mt-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Exceeds standard table capacity ({selectedTable.capacity})!</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Short action buttons */}
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedTableId(null)}
                      className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white text-center cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-semibold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/10 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  {/* Order shortcuts */}
                  {selectedTable.status === 'Occupied' ? (
                    <button
                      onClick={() => {
                        onSelectTableForOrder(selectedTable.number);
                        setSelectedTableId(null);
                      }}
                      className="w-full mt-1.5 py-2.5 bg-amber-500/10 hover:bg-amber-500/15 border border-gold-500/30 rounded-xl text-xs font-bold text-gold-500 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <UtensilsCrossed className="w-4 h-4 animate-pulse" />
                      <span>Add / Manage Table Orders</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Mark occupied first
                        onUpdateTable(selectedTable.id, {
                          status: 'Occupied',
                          customerName: 'Seated Customer',
                          guestsCount: 2
                        });
                        onSelectTableForOrder(selectedTable.number);
                        setSelectedTableId(null);
                      }}
                      className="w-full mt-1.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Seat Guest & Create Order</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
