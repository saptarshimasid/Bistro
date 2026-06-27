import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Grid3X3,
  Receipt,
  Utensils,
  ChefHat,
  CalendarDays,
  CreditCard,
  PackageCheck,
  Users,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { UserProfile, SystemSettings } from '../types';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  settings: SystemSettings;
}

export default function Sidebar({
  currentTab,
  setTab,
  user,
  onLogout,
  isCollapsed,
  setIsCollapsed,
  settings
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager'] },
    { id: 'tables', label: 'Table Management', icon: Grid3X3, roles: ['Admin', 'Manager', 'Waiter'] },
    { id: 'orders', label: 'Order Entry', icon: Receipt, roles: ['Admin', 'Manager', 'Waiter'] },
    { id: 'menu', label: 'Menu Catalog', icon: Utensils, roles: ['Admin', 'Manager', 'Chef'] },
    { id: 'kds', label: 'Kitchen System', icon: ChefHat, roles: ['Admin', 'Chef'] },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays, roles: ['Admin', 'Manager', 'Waiter'] },
    { id: 'billing', label: 'Billing & Cash', icon: CreditCard, roles: ['Admin', 'Cashier'] },
    { id: 'inventory', label: 'Inventory Stock', icon: PackageCheck, roles: ['Admin', 'Manager', 'Chef'] },
    { id: 'staff', label: 'Staff Roster', icon: Users, roles: ['Admin', 'Manager'] },
    { id: 'reports', label: 'Sales Reports', icon: TrendingUp, roles: ['Admin', 'Manager'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin'] }
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '76px' : '260px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative shrink-0 min-h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between overflow-hidden z-20 font-sans"
      id="sidebar-container"
    >
      {/* Top Brand Logo */}
      <div>
        <div className={`h-16 flex items-center border-b border-white/[0.05] ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`} id="sidebar-header">
          {!isCollapsed ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 overflow-hidden w-full"
              >
                {settings.brandLogo ? (
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 border border-white/10 flex items-center justify-center p-0.5">
                    <img src={settings.brandLogo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="p-1.5 bg-gradient-to-br from-gold-500 to-amber-600 rounded-lg text-black flex-shrink-0">
                    <ChefHat className="w-5 h-5" />
                  </div>
                )}
                <span className="font-display font-extrabold text-base text-white tracking-tight truncate max-w-[160px]" title={settings.restaurantName}>
                  {settings.restaurantName}
                </span>
              </motion.div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Collapse menu"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full relative group cursor-pointer" onClick={toggleSidebar}>
              {/* Logo in the center */}
              <div className="group-hover:opacity-0 transition-opacity duration-200 flex items-center justify-center">
                {settings.brandLogo ? (
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-0.5">
                    <img src={settings.brandLogo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="p-1.5 bg-gradient-to-br from-gold-500 to-amber-600 rounded-lg text-black">
                    <ChefHat className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              {/* ChevronRight Button on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu Grid */}
        <nav className="p-3 space-y-1" id="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            const hasPermission = item.roles.includes(user.role);

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full group flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? 'bg-white/10 text-gold-500 font-bold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
                }`}
                title={item.label}
              >
                {/* Active Accent Bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-gold-500 to-amber-600 rounded-r-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon className={`w-[20px] h-[20px] shrink-0 transition-colors ${
                  isActive ? 'text-gold-500' : 'text-gray-400 group-hover:text-gray-300'
                }`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-sans truncate">{item.label}</span>
                    {/* Role Indicator Dots for Guided Experience */}
                    {hasPermission ? (
                      <div className="w-1 h-1 rounded-full bg-emerald-500/40" title="Full Permission" />
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-white/10" title="Restricted Standard View" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-white/[0.05]" id="sidebar-footer">
        {/* Collapse Toggle for Collapsed State */}
        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-full py-2.5 mb-3 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white cursor-pointer"
            title="Expand menu"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* User Card */}
        {!isCollapsed && (
          <div className="p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-xl mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-lg object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-gold-500/10 border border-gold-500/25 rounded text-gold-500">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center justify-center gap-2.5 py-2.5 text-xs font-medium bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer ${
            isCollapsed ? 'px-0' : 'px-4'
          }`}
          title="Sign out of portal"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="font-sans">Exit Portal</span>}
        </button>
      </div>
    </motion.aside>
  );
}
