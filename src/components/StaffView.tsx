import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Star, 
  Phone, 
  Clock, 
  Calendar, 
  Plus, 
  Check, 
  ShieldAlert,
  ChevronDown,
  Info,
  TrendingUp,
  X,
  Activity,
  AlertCircle,
  Award,
  Timer
} from 'lucide-react';
import { StaffMember, UserRole, Order, UserProfile } from '../types';

interface StaffViewProps {
  staff: StaffMember[];
  orders: Order[];
  onUpdateStaffAttendance: (staffId: string, status: 'Present' | 'Absent' | 'On Leave') => void;
  onUpdateStaffShiftTiming: (staffId: string, shiftTiming: string) => void;
  onBulkUpdateStaffShifts: (shifts: { staffId: string; suggestedShift: string }[]) => void;
  onAddStaffMember: (member: StaffMember) => void;
  themeStyle: 'gold' | 'platinum';
  currentUser?: UserProfile | null;
}

export default function StaffView({
  staff,
  orders,
  onUpdateStaffAttendance,
  onUpdateStaffShiftTiming,
  onBulkUpdateStaffShifts,
  onAddStaffMember,
  themeStyle,
  currentUser
}: StaffViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  const [selectedPerformanceStaffId, setSelectedPerformanceStaffId] = useState<string>('');

  // 1. Find active staff member to show stats for (falls back from logged in user to first Waiter)
  const activeStaff = React.useMemo(() => {
    if (selectedPerformanceStaffId) {
      return staff.find(s => s.id === selectedPerformanceStaffId) || null;
    }
    if (currentUser) {
      const match = staff.find(s => 
        s.id === currentUser.id || 
        s.name.toLowerCase() === currentUser.name.toLowerCase()
      );
      if (match) return match;
    }
    return staff.find(s => s.role === 'Waiter') || staff[0] || null;
  }, [staff, currentUser, selectedPerformanceStaffId]);

  // 2. Compute performance metrics for this specific staff member
  const personalStats = React.useMemo(() => {
    if (!activeStaff) return null;

    const isWaiter = activeStaff.role === 'Waiter';
    const isChef = activeStaff.role === 'Chef';

    // Calculate orders handled by this employee
    const handledOrders = orders.filter(o => {
      if (isWaiter) {
        return o.waiterId === activeStaff.id || (o.waiterName && o.waiterName === activeStaff.name);
      }
      if (isChef) {
        return o.status === 'Ready' || o.status === 'Served' || o.status === 'Paid';
      }
      return o.status === 'Served' || o.status === 'Paid';
    });

    const totalServed = handledOrders.filter(o => o.status === 'Served' || o.status === 'Paid').length;

    let avgCompletionTime = 0;
    const completedOrdersWithTime = handledOrders.filter(o => o.createdAt && o.updatedAt && (o.status === 'Served' || o.status === 'Paid'));

    if (completedOrdersWithTime.length > 0) {
      const totalMins = completedOrdersWithTime.reduce((sum, o) => {
        const created = new Date(o.createdAt).getTime();
        const updated = new Date(o.updatedAt).getTime();
        const diff = (updated - created) / (1000 * 60);
        return sum + (diff > 0 ? diff : 15);
      }, 0);
      avgCompletionTime = parseFloat((totalMins / completedOrdersWithTime.length).toFixed(1));
    } else {
      if (isChef) {
        avgCompletionTime = 25 - (activeStaff.performanceRating * 2.5);
      } else if (isWaiter) {
        avgCompletionTime = 35 - (activeStaff.performanceRating * 3.5);
      } else {
        avgCompletionTime = 30 - (activeStaff.performanceRating * 3);
      }
      avgCompletionTime = parseFloat(avgCompletionTime.toFixed(1));
    }

    return {
      totalServed,
      avgCompletionTime,
      handledOrdersCount: handledOrders.length
    };
  }, [activeStaff, orders]);

  // 3. Compute team average benchmark (for comparing with equivalent team)
  const teamBenchmark = React.useMemo(() => {
    if (!activeStaff) return { avgOrders: 10, avgTime: 25 };

    const roleToCompare = activeStaff.role;
    const teamMembers = staff.filter(s => s.role === roleToCompare);
    
    let totalOrdersSum = 0;
    let totalTimesSum = 0;

    teamMembers.forEach(member => {
      const isW = member.role === 'Waiter';
      const isC = member.role === 'Chef';

      const memberOrders = orders.filter(o => {
        if (isW) return o.waiterId === member.id || (o.waiterName && o.waiterName === member.name);
        if (isC) return o.status === 'Ready' || o.status === 'Served' || o.status === 'Paid';
        return o.status === 'Served' || o.status === 'Paid';
      });

      const memberServed = memberOrders.filter(o => o.status === 'Served' || o.status === 'Paid').length;
      totalOrdersSum += memberServed;

      let memberAvgTime = 0;
      const completedWithTime = memberOrders.filter(o => o.createdAt && o.updatedAt && (o.status === 'Served' || o.status === 'Paid'));

      if (completedWithTime.length > 0) {
        const totalMins = completedWithTime.reduce((sum, o) => {
          const created = new Date(o.createdAt).getTime();
          const updated = new Date(o.updatedAt).getTime();
          const diff = (updated - created) / (1000 * 60);
          return sum + (diff > 0 ? diff : 15);
        }, 0);
        memberAvgTime = totalMins / completedWithTime.length;
      } else {
        if (isC) memberAvgTime = 25 - (member.performanceRating * 2.5);
        else if (isW) memberAvgTime = 35 - (member.performanceRating * 3.5);
        else memberAvgTime = 30 - (member.performanceRating * 3);
      }

      totalTimesSum += memberAvgTime;
    });

    const divisor = teamMembers.length || 1;
    const avgOrders = parseFloat((totalOrdersSum / divisor).toFixed(1));
    const avgTime = parseFloat((totalTimesSum / divisor).toFixed(1));

    return {
      avgOrders: avgOrders > 0 ? avgOrders : (roleToCompare === 'Chef' ? 24 : 12.5),
      avgTime: avgTime > 0 ? parseFloat(avgTime.toFixed(1)) : (roleToCompare === 'Chef' ? 14.5 : 22.0)
    };
  }, [activeStaff, staff, orders]);

  // Compute percentages for stats comparisons
  const volumePercent = React.useMemo(() => {
    if (!personalStats) return 0;
    const diff = personalStats.totalServed - teamBenchmark.avgOrders;
    return Math.round((diff / (teamBenchmark.avgOrders || 1)) * 100);
  }, [personalStats, teamBenchmark]);

  const speedPercent = React.useMemo(() => {
    if (!personalStats) return 0;
    const diff = teamBenchmark.avgTime - personalStats.avgCompletionTime;
    return Math.round((diff / (teamBenchmark.avgTime || 1)) * 100);
  }, [personalStats, teamBenchmark]);
  
  // AI Smart Scheduling states
  const [showSmartScheduleModal, setShowSmartScheduleModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    predictedPeaks: {
      timeRange: string;
      intensity: 'Low' | 'Medium' | 'High' | 'Critical';
      description: string;
    }[];
    scheduleSuggestions: {
      staffId: string;
      staffName: string;
      role: string;
      suggestedShift: string;
      reason: string;
    }[];
    capacityCoverage: {
      shiftName: string;
      staffCount: number;
      coverageLevel: 'Understaffed' | 'Optimal' | 'Robust';
    }[];
    executiveSummary: string;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Roster addition modal controller
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Waiter');
  const [contact, setContact] = useState('');
  const [shiftTiming, setShiftTiming] = useState('04:00 PM - 12:00 AM');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const filteredStaff = staff.filter((s) => {
    const matchesRole = roleFilter === 'All' || s.role === roleFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.contact.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  const handleFetchSmartSchedule = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/ai/smart-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff, orders }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate smart schedule recommendations');
      }
      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error contacting AI Operations Scheduler');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAllSuggestedShifts = () => {
    if (!aiResult) return;
    const bulkShifts = aiResult.scheduleSuggestions.map((s) => ({
      staffId: s.staffId,
      suggestedShift: s.suggestedShift
    }));
    onBulkUpdateStaffShifts(bulkShifts);
    setShowSmartScheduleModal(false);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) {
      alert('Please fill out all employee fields.');
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newStaff: StaffMember = {
      id: `s_${Date.now()}_${randomSuffix}`,
      name,
      role,
      contact,
      shiftTiming,
      attendanceStatus: 'Present',
      performanceRating: 5.0,
      image
    };

    onAddStaffMember(newStaff);

    // Reset Form
    setName('');
    setContact('');
    setShowAddModal(false);
  };

  const rolesList: ('All' | UserRole)[] = ['All', 'Admin', 'Manager', 'Chef', 'Waiter', 'Cashier'];

  return (
    <div className="p-6 space-y-6 font-sans text-left">
      
      {/* Personal Performance Bento Widget */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121215]/60 border border-white/5 backdrop-blur-md p-6 rounded-3xl relative overflow-hidden"
        id="personal-performance-widget"
      >
        {/* Subtle glowing ambient backgrounds */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-20 -mr-20 -mt-20 transition-all duration-700 ${
          themeStyle === 'gold' ? 'bg-amber-500' : 'bg-cyan-500'
        }`} />
        <div className={`absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[100px] pointer-events-none opacity-10 -ml-20 -mb-20 transition-all duration-700 ${
          themeStyle === 'gold' ? 'bg-gold-500' : 'bg-blue-500'
        }`} />

        <div className="relative z-10 flex flex-col xl:flex-row gap-6 items-stretch justify-between">
          {/* Identity & Switcher */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 xl:w-[35%] shrink-0 border-b xl:border-b-0 xl:border-r border-white/5 pb-5 xl:pb-0 xl:pr-6">
            <div className="relative">
              <img
                src={activeStaff?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={activeStaff?.name}
                className={`w-20 h-20 rounded-2xl object-cover border-2 shadow-xl ${
                  themeStyle === 'gold' ? 'border-gold-500/30' : 'border-cyan-400/30'
                }`}
                referrerPolicy="no-referrer"
              />
              <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg border text-black font-extrabold ${
                themeStyle === 'gold' ? 'bg-gold-500 border-gold-400' : 'bg-cyan-400 border-cyan-300'
              }`}>
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-center sm:justify-start">
                <span className="text-xs font-mono tracking-wider text-gray-400 uppercase font-bold">
                  Personal Performance
                </span>
                {currentUser && activeStaff?.id === currentUser?.id && (
                  <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    themeStyle === 'gold' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                  }`}>
                    Logged In
                  </span>
                )}
              </div>
              <h3 className="text-xl font-display font-black text-white leading-tight">
                {activeStaff?.name || 'Unknown Staff'}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Role: <span className="text-gray-300 font-bold">{activeStaff?.role || 'Staff'}</span> • Rating: <span className="text-gold-500 font-bold">{activeStaff?.performanceRating || '5.0'}★</span>
              </p>

              {/* Interactive Staff Profile Switcher Dropdown */}
              <div className="mt-3">
                <label className="text-[9px] text-gray-500 uppercase font-mono block mb-1">
                  Inspect / Swap Profile
                </label>
                <div className="relative inline-block w-full">
                  <select
                    value={selectedPerformanceStaffId || activeStaff?.id || ''}
                    onChange={(e) => setSelectedPerformanceStaffId(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-1.5 px-3 pr-8 text-xs text-gray-300 focus:outline-none focus:border-gold-500 cursor-pointer appearance-none"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#121215] text-white">
                        {s.name} ({s.role}){s.id === currentUser?.id ? ' (You)' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bento Grid Container */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stat 1: Served Orders Card */}
            <div className="bg-[#18181c]/50 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                    {activeStaff?.role === 'Chef' ? 'Dishes Prepared' : 'Orders Served'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono font-black text-white">
                      {personalStats?.totalServed ?? 0}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      of {personalStats?.handledOrdersCount ?? 0} total
                    </span>
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${
                  themeStyle === 'gold' ? 'bg-amber-500/10 text-gold-500' : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              {/* Visual gauge comparison to team average */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>Team Avg: <strong className="text-white">{teamBenchmark.avgOrders}</strong></span>
                  <span>{volumePercent >= 0 ? `+${volumePercent}% above avg` : `${volumePercent}% of avg`}</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      volumePercent >= 0 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : themeStyle === 'gold' ? 'bg-gradient-to-r from-gold-500 to-amber-600' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(15, (personalStats?.totalServed ?? 0) / (teamBenchmark.avgOrders || 1) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    volumePercent >= 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {volumePercent >= 0 ? '🏆 High Volume Performer' : '⚙️ Average Volume Norms'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 2: Completion Speed Card */}
            <div className="bg-[#18181c]/50 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                    Avg Completion Time
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-mono font-black text-white">
                      {personalStats?.avgCompletionTime ?? 0}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      mins
                    </span>
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${
                  themeStyle === 'gold' ? 'bg-amber-500/10 text-gold-500' : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  <Timer className="w-5 h-5" />
                </div>
              </div>

              {/* Visual gauge comparison to team average */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>Team Avg: <strong className="text-white">{teamBenchmark.avgTime}m</strong></span>
                  <span>{speedPercent >= 0 ? `${speedPercent}% faster` : `${Math.abs(speedPercent)}% slower`}</span>
                </div>
                {/* Gauge for speed */}
                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      speedPercent >= 0 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                        : 'bg-gradient-to-r from-rose-500 to-amber-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, Math.max(15, Math.round((teamBenchmark.avgTime / (personalStats?.avgCompletionTime || 1)) * 50)))}%` 
                    }}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    speedPercent >= 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {speedPercent >= 0 ? '⚡ Ultra-Fast Turnaround' : '⏱️ Standard Pace'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 1. Header controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4" id="staff-controls">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none w-4 h-4 my-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roster directories..."
              className="w-full bg-[#121215] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs text-white"
            />
          </div>

          {/* Role selector filters */}
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {rolesList.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  roleFilter === r
                    ? 'bg-amber-500/15 border border-gold-500/25 text-gold-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {/* Register employee button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Team Member</span>
          </button>
        </div>
      </div>



      {/* 2. Staff Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5" id="staff-cards-grid">
        {filteredStaff.map((member) => {
          let statusBadge = 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400';
          if (member.attendanceStatus === 'Absent') statusBadge = 'bg-red-500/10 border-red-500/15 text-red-400';
          if (member.attendanceStatus === 'On Leave') statusBadge = 'bg-amber-500/10 border-amber-500/15 text-amber-500';

          return (
            <motion.div
              key={member.id}
              layoutId={`staff-member-card-${member.id}`}
              whileHover={{ y: -4 }}
              className="glass-card p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-gold-500/20 text-left relative overflow-hidden"
            >
              {/* Profile card layout */}
              <div className="space-y-4">
                
                {/* Image and basic headers */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/5"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm tracking-tight leading-tight line-clamp-1">{member.name}</h4>
                    <span className="inline-block text-[9px] uppercase font-mono px-2 py-0.5 bg-gold-500/10 border border-gold-500/20 rounded text-gold-500 font-semibold">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Shift hours & phone */}
                <div className="space-y-1.5 text-xs text-gray-400 border-t border-white/[0.04] pt-3">
                  <div className="flex items-center gap-1.5 text-[11px] w-full">
                    <Clock className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <select
                      value={member.shiftTiming}
                      onChange={(e) => onUpdateStaffShiftTiming(member.id, e.target.value)}
                      className="bg-transparent border-none text-gray-300 font-mono text-[11px] p-0 focus:ring-0 focus:outline-none cursor-pointer hover:text-white"
                    >
                      <option value="08:00 AM - 04:00 PM" className="bg-[#121215] text-white">Morning (08:00 AM - 04:00 PM)</option>
                      <option value="11:00 AM - 07:00 PM" className="bg-[#121215] text-white">Day (11:00 AM - 07:00 PM)</option>
                      <option value="04:00 PM - 12:00 AM" className="bg-[#121215] text-white">Evening (04:00 PM - 12:00 AM)</option>
                      <option value="12:00 PM - 10:00 PM" className="bg-[#121215] text-white">Chef (12:00 PM - 10:00 PM)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span className="font-sans text-gray-300">{member.contact}</span>
                  </div>
                </div>

                {/* Rating display */}
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-500 text-[11px]">Performance:</span>
                  <div className="flex items-center gap-0.5 text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${
                          i < Math.floor(member.performanceRating) ? 'fill-gold-500' : 'text-gray-600'
                        }`} 
                      />
                    ))}
                    <span className="text-[10px] font-mono font-bold text-gray-300 ml-1">({member.performanceRating})</span>
                  </div>
                </div>

              </div>

              {/* Attendance quick toggle */}
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <span className={`text-[9px] uppercase font-bold tracking-wider font-mono px-2 py-0.5 rounded border ${statusBadge}`}>
                  {member.attendanceStatus}
                </span>

                {/* State selector dropdown */}
                <select
                  value={member.attendanceStatus}
                  onChange={(e) => onUpdateStaffAttendance(member.id, e.target.value as any)}
                  className="bg-black/40 border border-white/5 focus:outline-none rounded-lg py-1 px-2 text-[10px] text-gray-400 hover:text-white cursor-pointer"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* 3. Register Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-card p-6 rounded-2xl relative text-left glow-gold"
              id="add-staff-modal"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Register Team Roster</h3>
                  <p className="text-xs text-gray-400 font-sans">Enlist new personnel credentials</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-4">
                {/* Employee Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Employee Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-sm text-white"
                    placeholder="e.g. Elena Rostova"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Business Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-[#0e0e11] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-2 text-xs text-white cursor-pointer"
                    >
                      <option value="Manager">Manager</option>
                      <option value="Chef">Chef</option>
                      <option value="Waiter">Waiter</option>
                      <option value="Cashier">Cashier</option>
                    </select>
                  </div>

                  {/* Contact */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phone Contact</label>
                    <input
                      type="tel"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
                      placeholder="+1 (555) 303-1212"
                    />
                  </div>
                </div>

                {/* Shift Hours */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Shift Timing Range</label>
                  <select
                    value={shiftTiming}
                    onChange={(e) => setShiftTiming(e.target.value)}
                    className="w-full bg-[#0e0e11] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-2 text-xs text-white cursor-pointer"
                  >
                    <option value="08:00 AM - 04:00 PM">Morning (08:00 AM - 04:00 PM)</option>
                    <option value="11:00 AM - 07:00 PM">Day (11:00 AM - 07:00 PM)</option>
                    <option value="04:00 PM - 12:00 AM">Evening (04:00 PM - 12:00 AM)</option>
                    <option value="12:00 PM - 10:00 PM">Double Chef (12:00 PM - 10:00 PM)</option>
                  </select>
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Profile Image URL</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-white/5 focus:border-gold-500 focus:outline-none rounded-xl py-2.5 px-3.5 text-xs text-white"
                    placeholder="https://images.unsplash.com/photo-..."
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
                    <span>Seat Employee</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showSmartScheduleModal && (
          <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#09090b] border border-white/10 p-6 rounded-2xl relative text-left shadow-2xl shadow-purple-500/5 my-8"
              id="smart-schedule-modal"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div className="flex items-center gap-2.5 text-left">
                  <span className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                    <Calendar className="w-5 h-5 animate-pulse" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">AI Smart Shift Schedule Strategist</h3>
                    <p className="text-xs text-gray-400 font-sans">Optimal labor hour suggestions derived from peak sales & order traffic densities</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSmartScheduleModal(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Loader */}
              {aiLoading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <Activity className="absolute inset-0 m-auto text-purple-400 w-6 h-6 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-white">Synthesizing Labor Demand Forecast...</p>
                    <p className="text-xs text-gray-500 font-mono">Running regression on peak hourly order throughput and waiter metrics</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {aiError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 my-6">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 text-left">
                    <h4 className="text-sm font-semibold text-white">Scheduling Sync Failed</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">{aiError}</p>
                    <button
                      onClick={handleFetchSmartSchedule}
                      className="px-3 py-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded text-red-400 text-[10px] font-mono cursor-pointer"
                    >
                      Retry Generation
                    </button>
                  </div>
                </div>
              )}

              {/* Results */}
              {aiResult && !aiLoading && !aiError && (
                <div className="space-y-6">
                  {/* Executive Summary & KPI Stats banner */}
                  <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 text-purple-500/10 pointer-events-none">
                      <TrendingUp className="w-16 h-16" />
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-purple-400 font-mono">Strategic Executive Summary</span>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-3xl font-sans">
                      {aiResult.executiveSummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column: Peak Hours & Shift Coverages */}
                    <div className="md:col-span-4 space-y-5">
                      {/* Predicted Peak Hours */}
                      <div className="space-y-2.5 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block font-mono">Predicted Traffic Peaks</span>
                        <div className="space-y-2">
                          {aiResult.predictedPeaks.map((peak, idx) => {
                            let tagColor = 'bg-gray-500/10 border-gray-500/25 text-gray-400';
                            if (peak.intensity === 'Critical') tagColor = 'bg-red-500/10 border-red-500/25 text-red-400';
                            else if (peak.intensity === 'High') tagColor = 'bg-orange-500/10 border-orange-500/25 text-orange-400';
                            else if (peak.intensity === 'Medium') tagColor = 'bg-amber-500/10 border-amber-500/25 text-amber-400';

                            return (
                              <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-xs font-bold text-white">{peak.timeRange}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${tagColor}`}>
                                    {peak.intensity}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-sans">{peak.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Capacity Coverage */}
                      <div className="space-y-2.5 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block font-mono">Capacity Coverage Analysis</span>
                        <div className="space-y-2">
                          {aiResult.capacityCoverage.map((cap, idx) => {
                            let badge = 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400';
                            if (cap.coverageLevel === 'Understaffed') badge = 'bg-red-500/10 border-red-500/25 text-red-400';
                            else if (cap.coverageLevel === 'Robust') badge = 'bg-blue-500/10 border-blue-500/25 text-blue-400';

                            return (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div className="text-left">
                                  <span className="text-xs font-semibold text-white block">{cap.shiftName} Shift</span>
                                  <span className="text-[10px] text-gray-500 font-mono">{cap.staffCount} roster assignments</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${badge}`}>
                                  {cap.coverageLevel}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: AI Roster Suggestions List */}
                    <div className="md:col-span-8 space-y-2.5 text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block font-mono">Suggested Employee Shift Mappings</span>
                      <div className="border border-white/5 rounded-xl bg-white/[0.01] overflow-hidden">
                        <div className="max-h-96 overflow-y-auto divide-y divide-white/[0.04] scrollbar-none">
                          {aiResult.scheduleSuggestions.map((suggestion) => {
                            const staffMember = staff.find(s => s.id === suggestion.staffId);
                            const rating = staffMember ? staffMember.performanceRating : 5.0;
                            const image = staffMember ? staffMember.image : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

                            return (
                              <div key={suggestion.staffId} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                                <div className="flex items-center gap-3 text-left">
                                  <img
                                    src={image}
                                    alt={suggestion.staffName}
                                    className="w-9 h-9 rounded-lg object-cover border border-white/5 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-white leading-tight">{suggestion.staffName}</span>
                                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-white/5 text-gray-400 rounded">
                                        {suggestion.role}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 leading-normal max-w-md font-sans">{suggestion.reason}</p>
                                  </div>
                                </div>
                                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
                                  <div className="bg-purple-500/10 border border-purple-500/20 rounded px-2.5 py-1 text-center font-mono text-[10px] text-purple-300 font-bold">
                                    {suggestion.suggestedShift}
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] mt-1 text-gold-500">
                                    <Star className="w-2.5 h-2.5 fill-gold-500" />
                                    <span className="font-mono font-bold">{rating}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply actions */}
                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between text-[11px] text-gray-500">
                    <span className="font-mono text-left">Applying will overwrite current shift timings for {aiResult.scheduleSuggestions.length} team members</span>
                    <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => setShowSmartScheduleModal(false)}
                        className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyAllSuggestedShifts}
                        className="py-2 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/15 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Apply Optimal Roster</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
