import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Clock, 
  Laptop, 
  Info, 
  CheckCheck,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile, UserRole, LiveActivity } from '../types';
import { INITIAL_STAFF } from '../data/mockData';

interface NavbarProps {
  currentTab: string;
  user: UserProfile;
  onChangeRole: (role: UserRole) => void;
  activities: LiveActivity[];
  onMarkActivityRead: (id: string) => void;
  onClearActivities: () => void;
  onSimulateActivity: () => void;
  themeStyle: 'gold' | 'platinum';
  setThemeStyle: (style: 'gold' | 'platinum') => void;
}

export default function Navbar({
  currentTab,
  user,
  onChangeRole,
  activities,
  onMarkActivityRead,
  onClearActivities,
  onSimulateActivity,
  themeStyle,
  setThemeStyle
}: NavbarProps) {
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Sync real-time clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return { title: 'Executive Dashboard', subtitle: 'Real-time overview of your restaurant’s vital metrics and sales.' };
      case 'tables': return { title: 'Interactive Floor Plan', subtitle: 'Monitor physical layout, service cycles, and seating availability.' };
      case 'orders': return { title: 'New Order Entry', subtitle: 'Select seating, add items to ticket, and configure special notes.' };
      case 'menu': return { title: 'Gastronomy Catalog', subtitle: 'Manage recipes, gourmet pricing, and category availabilities.' };
      case 'kds': return { title: 'Kitchen Display System (KDS)', subtitle: 'Chef dispatch hub. Monitor preparation timers and priority alerts.' };
      case 'reservations': return { title: 'Reservation Master List', subtitle: 'Review guest booking calendar, table preferences, and confirmations.' };
      case 'billing': return { title: 'Terminal Cashier & Invoicing', subtitle: 'Preview receipts, apply custom tax/discounts, and execute payments.' };
      case 'inventory': return { title: 'Gourmet Ingredient Stocks', subtitle: 'Verify raw resource volumes, supplier information, and expiration warnings.' };
      case 'staff': return { title: 'Employee Directory', subtitle: 'Verify attendance status, shifts, contacts, and performance ranks.' };
      case 'reports': return { title: 'Analytics & Sales Intelligence', subtitle: 'Examine detailed visual charts, category splits, and revenue trends.' };
      case 'settings': return { title: 'System Configurations', subtitle: 'Customize global parameters, restaurant profiling, and tax calculations.' };
      default: return { title: 'Control Panel', subtitle: 'Management portal.' };
    }
  };

  const currentDetails = getTabTitle(currentTab);

  // Roles for fast switching
  const roles: UserRole[] = ['Admin', 'Manager', 'Chef', 'Waiter', 'Cashier'];

  return (
    <header className="h-16 shrink-0 glass-navbar flex items-center justify-between px-6 z-10 relative font-sans">
      {/* Title & Description */}
      <div className="flex flex-col text-left">
        <h2 className="text-base font-bold text-white font-display tracking-tight flex items-center gap-2">
          {currentDetails.title}
          {themeStyle === 'platinum' && (
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded-full uppercase font-mono font-normal">
              Platinum Mode
            </span>
          )}
        </h2>
        <p className="text-xs text-gray-400 leading-tight truncate max-w-xs md:max-w-xl hidden sm:block">
          {currentDetails.subtitle}
        </p>
      </div>

      {/* Right Tools Panel */}
      <div className="flex items-center gap-4" id="navbar-tools">
        
        {/* Real-Time Digital Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-gray-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-gold-500" />
          <span>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </span>
        </div>

        {/* Theme Glow Switcher */}
        <button
          onClick={() => setThemeStyle(themeStyle === 'gold' ? 'platinum' : 'gold')}
          className="p-2 bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
          title={themeStyle === 'gold' ? 'Switch to Cyber Platinum theme' : 'Switch to Luxury Gold theme'}
        >
          {themeStyle === 'gold' ? (
            <Sun className="w-4 h-4 text-gold-500 animate-pulse" />
          ) : (
            <Laptop className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Fast Role Swapper Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleSelector(!showRoleSelector);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#121215] border border-white/5 hover:border-white/10 rounded-xl text-xs text-gray-300 cursor-pointer transition-all"
          >
            <User className={`w-3.5 h-3.5 ${themeStyle === 'gold' ? 'text-gold-500' : 'text-cyan-400'}`} />
            <span className="font-semibold hidden md:inline">Role: {user.role}</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>

          {showRoleSelector && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0e0e11] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 py-1.5 text-left">
              <div className="px-3 py-1.5 border-b border-white/5 mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-sans">
                  Impersonate Sandbox Role
                </span>
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onChangeRole(r);
                    setShowRoleSelector(false);
                  }}
                  className={`w-full px-3 py-2 text-xs font-sans text-left transition-colors flex items-center justify-between cursor-pointer ${
                    user.role === r 
                      ? 'bg-amber-500/10 text-gold-500 font-medium' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{r} View</span>
                  {user.role === r && (
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSelector(false);
            }}
            className="p-2 bg-[#121215] border border-white/5 hover:border-white/10 rounded-xl text-gray-300 hover:text-white relative cursor-pointer"
            title="Restaurant Live Feed"
          >
            <Bell className="w-4 h-4" />
            {activities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse glow-orange" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#0e0e11] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 flex flex-col text-left">
              <div className="p-3.5 border-b border-white/5 bg-[#121216] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gold-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Activity Stream</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onSimulateActivity}
                    className="text-[10px] px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 border border-gold-500/20 text-gold-500 rounded font-medium transition-all cursor-pointer"
                    title="Generate random restaurant event"
                  >
                    Simulate
                  </button>
                  <button
                    onClick={onClearActivities}
                    className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-all cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Feed List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-white/5 bg-[#0a0a0c]">
                {activities.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Info className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs">No active alerts or events.</p>
                  </div>
                ) : (
                  activities.map((act) => (
                    <div 
                      key={act.id} 
                      className="p-3 hover:bg-white/[0.02] transition-colors flex items-start gap-2.5 relative"
                    >
                      {/* Left dot signaling severity */}
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        act.severity === 'danger' ? 'bg-red-500 glow-red' :
                        act.severity === 'warning' ? 'bg-amber-500' :
                        act.severity === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300 leading-normal font-sans">
                          {act.message}
                        </p>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                          {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>

                      {/* Read status button */}
                      <button
                        onClick={() => onMarkActivityRead(act.id)}
                        className="text-gray-600 hover:text-gold-500 transition-colors p-1"
                        title="Dismiss"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
