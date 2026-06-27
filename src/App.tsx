/**
 * DineFlow RMS Main State Orchestrator
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Info } from 'lucide-react';

// Core imports
import { 
  UserProfile, 
  Table, 
  Order, 
  Reservation, 
  InventoryItem, 
  StaffMember, 
  LiveActivity, 
  SystemSettings, 
  MenuItem, 
  OrderStatus,
  UserRole,
  CustomerFeedback 
} from './types';

import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_TABLES, 
  INITIAL_ORDERS, 
  INITIAL_RESERVATIONS, 
  INITIAL_INVENTORY, 
  INITIAL_STAFF, 
  INITIAL_ACTIVITIES, 
  DEFAULT_SETTINGS, 
  INITIAL_FEEDBACK,
  loadData, 
  saveData 
} from './data/mockData';

// Component imports
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import TableManagementView from './components/TableManagementView';
import OrderManagementView from './components/OrderManagementView';
import MenuManagementView from './components/MenuManagementView';
import KdsView from './components/KdsView';
import ReservationView from './components/ReservationView';
import BillingView from './components/BillingView';
import InventoryView from './components/InventoryView';
import StaffView from './components/StaffView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import PublicMenuView from './components/PublicMenuView';

export default function App() {
  // 1. Core Authentication States
  const [user, setUser] = useState<UserProfile | null>(() => {
    return loadData<UserProfile | null>('user', null);
  });

  // 2. Active Tab State
  const [currentTab, setTab] = useState<string>(() => {
    return loadData<string>('currentTab', 'dashboard');
  });

  // Collapsible state for sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Theme Style (gold vs platinum)
  const [themeStyle, setThemeStyle] = useState<'gold' | 'platinum'>(() => {
    return loadData<'gold' | 'platinum'>('themeStyle', 'gold');
  });

  // 3. Operational Client States
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const loaded = loadData<MenuItem[]>('menu', INITIAL_MENU_ITEMS);
    if (loaded.length < 50) {
      return INITIAL_MENU_ITEMS;
    }
    return loaded;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    return loadData<Table[]>('tables', INITIAL_TABLES);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return loadData<Order[]>('orders', INITIAL_ORDERS);
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    return loadData<Reservation[]>('reservations', INITIAL_RESERVATIONS);
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    return loadData<InventoryItem[]>('inventory', INITIAL_INVENTORY);
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const loaded = loadData<StaffMember[]>('staff', INITIAL_STAFF);
    if (loaded.length < 10) {
      return INITIAL_STAFF;
    }
    return loaded;
  });

  const [activities, setActivities] = useState<LiveActivity[]>(() => {
    return loadData<LiveActivity[]>('activities', INITIAL_ACTIVITIES);
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    return loadData<SystemSettings>('settings', DEFAULT_SETTINGS);
  });

  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(() => {
    return loadData<CustomerFeedback[]>('feedbacks', INITIAL_FEEDBACK);
  });

  // Public menu view bypass state
  const [isPreviewPublicMenu, setIsPreviewPublicMenu] = useState<boolean>(() => {
    return window.location.search.includes('view=public-menu');
  });

  // URL checking effect to handle back/forward routing
  useEffect(() => {
    const handlePopState = () => {
      setIsPreviewPublicMenu(window.location.search.includes('view=public-menu'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Special intermediate seating transit state
  const [preselectedTableNumber, setPreselectedTableNumber] = useState<number | null>(null);

  // Sync core changes to LocalStorage
  useEffect(() => {
    saveData('user', user);
  }, [user]);

  useEffect(() => {
    saveData('currentTab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    saveData('themeStyle', themeStyle);
  }, [themeStyle]);

  // Dynamic CSS variable injection for brand colors
  useEffect(() => {
    const primary = settings.primaryBrandColor || '#f97316';
    const secondary = settings.secondaryBrandColor || '#ea580c';
    
    const hexToRgba = (hex: string, alpha: number): string => {
      let c = hex.substring(1);
      if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      }
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const adjustBrightness = (hex: string, percent: number): string => {
      let c = hex.substring(1);
      if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      }
      let r = parseInt(c.substring(0, 2), 16);
      let g = parseInt(c.substring(2, 4), 16);
      let b = parseInt(c.substring(4, 6), 16);

      r = Math.max(0, Math.min(255, Math.round(r * (1 + percent))));
      g = Math.max(0, Math.min(255, Math.round(g * (1 + percent))));
      b = Math.max(0, Math.min(255, Math.round(b * (1 + percent))));

      const rHex = r.toString(16).padStart(2, '0');
      const gHex = g.toString(16).padStart(2, '0');
      const bHex = b.toString(16).padStart(2, '0');

      return `#${rHex}${gHex}${bHex}`;
    };

    const root = document.documentElement;
    root.style.setProperty('--gold-5-color', hexToRgba(primary, 0.05));
    root.style.setProperty('--gold-10-color', hexToRgba(primary, 0.1));
    root.style.setProperty('--gold-15-color', hexToRgba(primary, 0.15));
    root.style.setProperty('--gold-20-color', hexToRgba(primary, 0.2));
    root.style.setProperty('--gold-25-color', hexToRgba(primary, 0.25));
    root.style.setProperty('--gold-5-color', hexToRgba(primary, 0.05));
    root.style.setProperty('--gold-50-color', adjustBrightness(primary, 0.9));
    root.style.setProperty('--gold-100-color', adjustBrightness(primary, 0.75));
    root.style.setProperty('--gold-500-color', primary);
    root.style.setProperty('--gold-600-color', secondary);
    root.style.setProperty('--gold-700-color', adjustBrightness(secondary, -0.2));
    root.style.setProperty('--glow-shadow', hexToRgba(primary, 0.25));
  }, [settings.primaryBrandColor, settings.secondaryBrandColor]);

  // Activity stream logger helper
  const logActivity = (type: LiveActivity['type'], message: string, severity: LiveActivity['severity'] = 'info') => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const newAct: LiveActivity = {
      id: `act_${Date.now()}_${randomId}`,
      type,
      message,
      time: new Date().toISOString(),
      severity
    };
    
    setActivities((prev) => {
      const next = [newAct, ...prev].slice(0, 50); // Keep up to 50 logs
      saveData('activities', next);
      return next;
    });
  };

  // 4. Action Handlers
  
  // Login / Logout
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    logActivity('staff', `${newUser.name} logged in as ${newUser.role}. Sandbox portal unlocked.`, 'success');
  };

  const handleLogout = () => {
    if (user) {
      logActivity('staff', `${user.name} exited the sandbox portal.`, 'info');
    }
    setUser(null);
  };

  const handleChangeRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    logActivity('staff', `User privilege adjusted to ${newRole} mode. Navigating features.`, 'info');
  };

  // Table status updating
  const handleUpdateTable = (tableId: string, updates: Partial<Table>) => {
    setTables((prev) => {
      const next = prev.map((t) => {
        if (t.id === tableId) {
          const merged = { ...t, ...updates };
          
          // Log operational changes
          if (updates.status && updates.status !== t.status) {
            logActivity(
              'table', 
              `Table ${t.number} status modified from ${t.status} to ${updates.status}.`, 
              updates.status === 'Cleaning' ? 'warning' : 'info'
            );
          }
          return merged;
        }
        return t;
      });
      saveData('tables', next);
      return next;
    });
  };

  // Order routing transition shortcut
  const handleSelectTableForOrder = (tableNumber: number) => {
    setPreselectedTableNumber(tableNumber);
    setTab('orders');
  };

  const handleClearPreselectedTable = () => {
    setPreselectedTableNumber(null);
  };

  // Kitchen order status tracking
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, status: nextStatus, updatedAt: new Date().toISOString() };
          
          // Log transitions
          if (nextStatus === 'Preparing') {
            logActivity('order', `Order ticket ${o.orderNumber} (Table ${o.tableNumber}) is now cooking.`, 'info');
          } else if (nextStatus === 'Ready') {
            logActivity('order', `Order ticket ${o.orderNumber} (Table ${o.tableNumber}) marked ready for pickup.`, 'success');
          } else if (nextStatus === 'Served') {
            logActivity('order', `Order ticket ${o.orderNumber} (Table ${o.tableNumber}) served to seated guest.`, 'success');
          }
          return updated;
        }
        return o;
      });
      saveData('orders', next);
      return next;
    });
  };

  // Pay out settlement
  const handlePayOrder = (orderId: string, paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Wallet') => {
    let targetedTableNum = 0;
    
    setOrders((prevOrders) => {
      const nextOrders = prevOrders.map((o) => {
        if (o.id === orderId) {
          targetedTableNum = o.tableNumber;
          return { ...o, status: 'Paid' as OrderStatus, paymentMethod, updatedAt: new Date().toISOString() };
        }
        return o;
      });
      saveData('orders', nextOrders);
      return nextOrders;
    });

    // Update physical Seating table status to Cleaning, clearing guest variables
    if (targetedTableNum > 0) {
      setTables((prevTables) => {
        const nextTables = prevTables.map((t) => {
          if (t.number === targetedTableNum) {
            return {
              ...t,
              status: 'Cleaning' as const,
              currentOrderId: undefined,
              customerName: undefined,
              guestsCount: undefined
            };
          }
          return t;
        });
        saveData('tables', nextTables);
        return nextTables;
      });

      logActivity(
        'order', 
        `Invoice ticket for Table ${targetedTableNum} settled via ${paymentMethod}. Seating marked for Cleaning.`, 
        'success'
      );
    }
  };

  // Add a brand-new order from Waiter Entry
  const handleAddOrder = (newOrderOmit: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const orderId = `o_${Date.now()}_${randomSuffix}`;
    const orderNum = `DF-${orders.length + 4001}`;
    
    const newOrder: Order = {
      ...newOrderOmit,
      id: orderId,
      orderNumber: orderNum,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      saveData('orders', next);
      return next;
    });

    // Mark Seating table status as Occupied and hook order details
    setTables((prevTables) => {
      const nextTables = prevTables.map((t) => {
        if (t.number === newOrder.tableNumber) {
          return {
            ...t,
            status: 'Occupied' as const,
            currentOrderId: orderId,
            customerName: newOrderOmit.customerName || 'Walk-In Guest',
            guestsCount: newOrderOmit.items.reduce((sum, item) => sum + item.quantity, 0)
          };
        }
        return t;
      });
      saveData('tables', nextTables);
      return nextTables;
    });

    logActivity('order', `New dining order ticket ${orderNum} created for Table ${newOrder.tableNumber}.`, 'info');
  };

  // Reservation calendar entries
  const handleAddReservation = (newResOmit: Omit<Reservation, 'id' | 'createdAt'>) => {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newRes: Reservation = {
      ...newResOmit,
      id: `r_${Date.now()}_${randomSuffix}`,
      createdAt: new Date().toISOString()
    };

    setReservations((prev) => {
      const next = [newRes, ...prev];
      saveData('reservations', next);
      return next;
    });

    logActivity('reservation', `Booking confirmed for ${newRes.customerName} (Party of ${newRes.guests}) on ${newRes.date}.`, 'success');
  };

  const handleUpdateReservationStatus = (resId: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    setReservations((prev) => {
      const next = prev.map((r) => {
        if (r.id === resId) {
          logActivity(
            'reservation', 
            `Reservation booking for ${r.customerName} marked as ${status.toUpperCase()}.`, 
            status === 'Cancelled' ? 'danger' : 'success'
          );
          return { ...r, status };
        }
        return r;
      });
      saveData('reservations', next);
      return next;
    });
  };

  const handleSeatReservedGuest = (customerName: string, guestsCount: number, prefTableNumber: number) => {
    // Find table matching preferred number, and sit them down
    setTables((prevTables) => {
      const nextTables = prevTables.map((t) => {
        if (t.number === prefTableNumber) {
          return {
            ...t,
            status: 'Occupied' as const,
            customerName,
            guestsCount
          };
        }
        return t;
      });
      saveData('tables', nextTables);
      return nextTables;
    });

    logActivity('table', `Reserved booking guest ${customerName} seated at Table ${prefTableNumber}. Creating ticket.`, 'success');
    
    // Jump to orders tab
    setPreselectedTableNumber(prefTableNumber);
    setTab('orders');
  };

  // Culinary Menu editing
  const handleAddMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => {
      const next = [...prev, item];
      saveData('menu', next);
      return next;
    });
    logActivity('inventory', `Gourmet dish "${item.name}" registered into restaurant catalog database.`, 'success');
  };

  const handleUpdateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => {
      const next = prev.map((m) => {
        if (m.id === id) {
          const merged = { ...m, ...updates };
          if (updates.available !== undefined && updates.available !== m.available) {
            logActivity(
              'inventory', 
              `Dishes "${m.name}" availability set to ${updates.available ? 'AVAILABLE' : 'SOLD OUT'}.`, 
              updates.available ? 'success' : 'warning'
            );
          }
          return merged;
        }
        return m;
      });
      saveData('menu', next);
      return next;
    });
  };

  const handleDeleteMenuItem = (id: string) => {
    let itemName = '';
    setMenuItems((prev) => {
      const item = prev.find((m) => m.id === id);
      itemName = item?.name || '';
      const next = prev.filter((m) => m.id !== id);
      saveData('menu', next);
      return next;
    });
    if (itemName) {
      logActivity('inventory', `Dish "${itemName}" retired from restaurant catalog.`, 'danger');
    }
  };

  // Inventory Stock restocking
  const handleRestockItem = (itemId: string, amount: number) => {
    setInventory((prev) => {
      const next = prev.map((i) => {
        if (i.id === itemId) {
          const nextStock = i.currentStock + amount;
          logActivity('inventory', `Restocked raw stock of "${i.name}" by +${amount} ${i.unit}. Stock volume: ${nextStock} ${i.unit}.`, 'success');
          return { ...i, currentStock: nextStock };
        }
        return i;
      });
      saveData('inventory', next);
      return next;
    });
  };

  const handleAddInventoryItem = (item: InventoryItem) => {
    setInventory((prev) => {
      const next = [...prev, item];
      saveData('inventory', next);
      return next;
    });
    logActivity('inventory', `Raw supplier item "${item.name}" registered into inventory list.`, 'info');
  };

  // Staff roster adjustments
  const handleUpdateStaffAttendance = (staffId: string, status: 'Present' | 'Absent' | 'On Leave') => {
    setStaff((prev) => {
      const next = prev.map((s) => {
        if (s.id === staffId) {
          logActivity('staff', `Employee ${s.name} attendance logged as: ${status.toUpperCase()}.`, 'info');
          return { ...s, attendanceStatus: status };
        }
        return s;
      });
      saveData('staff', next);
      return next;
    });
  };

  const handleUpdateStaffShiftTiming = (staffId: string, shiftTiming: string) => {
    setStaff((prev) => {
      const next = prev.map((s) => {
        if (s.id === staffId) {
          logActivity('staff', `Employee ${s.name} shift updated to: ${shiftTiming}.`, 'info');
          return { ...s, shiftTiming };
        }
        return s;
      });
      saveData('staff', next);
      return next;
    });
  };

  const handleBulkUpdateStaffShifts = (shifts: { staffId: string; suggestedShift: string }[]) => {
    setStaff((prev) => {
      const next = prev.map((s) => {
        const match = shifts.find((sh) => sh.staffId === s.id);
        if (match) {
          return { ...s, shiftTiming: match.suggestedShift };
        }
        return s;
      });
      saveData('staff', next);
      return next;
    });
    logActivity('staff', `Applied smart predictive scheduling to active roster.`, 'success');
  };

  const handleAddStaffMember = (member: StaffMember) => {
    setStaff((prev) => {
      const next = [...prev, member];
      saveData('staff', next);
      return next;
    });
    logActivity('staff', `Registered new team roster: ${member.name} as ${member.role}.`, 'success');
  };

  // General settings saving
  const handleSaveSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    saveData('settings', newSettings);
    logActivity('staff', `System settings successfully updated. Changes applied to billing tax rates.`, 'success');
  };

  // Feedback Handlers
  const handleAddFeedback = (newFb: Omit<CustomerFeedback, 'id' | 'createdAt'>) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const completedFb: CustomerFeedback = {
      ...newFb,
      id: `fb_${Date.now()}_${randomId}`,
      createdAt: new Date().toISOString()
    };
    setFeedbacks((prev) => {
      const next = [completedFb, ...prev];
      saveData('feedbacks', next);
      return next;
    });
    logActivity('staff', `New customer feedback submitted by ${newFb.customerName} (${newFb.rating}★).`, 'success');
  };

  const handleUpdateFeedbackStatus = (id: string, status: CustomerFeedback['status']) => {
    setFeedbacks((prev) => {
      const next = prev.map((f) => f.id === id ? { ...f, status } : f);
      saveData('feedbacks', next);
      return next;
    });
    logActivity('staff', `Feedback status updated to ${status}.`, 'info');
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbacks((prev) => {
      const next = prev.filter((f) => f.id !== id);
      saveData('feedbacks', next);
      return next;
    });
    logActivity('staff', `Customer feedback entry removed.`, 'warning');
  };

  // Reset database values back to defaults
  const handleResetSystemData = () => {
    localStorage.removeItem('dineflow_tables');
    localStorage.removeItem('dineflow_orders');
    localStorage.removeItem('dineflow_reservations');
    localStorage.removeItem('dineflow_inventory');
    localStorage.removeItem('dineflow_staff');
    localStorage.removeItem('dineflow_activities');
    localStorage.removeItem('dineflow_settings');
    localStorage.removeItem('dineflow_menu');
    localStorage.removeItem('dineflow_user');
    localStorage.removeItem('dineflow_currentTab');
    localStorage.removeItem('dineflow_themeStyle');
    localStorage.removeItem('dineflow_feedbacks');

    logActivity('staff', `System database purge requested. Re-instating seed configuration...`, 'danger');
    
    // Hard refresh page to reload and clear client state instantly
    window.location.reload();
  };

  // Simulated live notification generator (Sandbox play value)
  const handleSimulateActivity = () => {
    const mockMsgs = [
      { type: 'order' as const, message: 'Waiter David Lee created a new checkout ticket for Table 12.', severity: 'info' as const },
      { type: 'inventory' as const, message: 'Low stock warning: White Truffle Oil is running below minimum limit (1.2L left).', severity: 'warning' as const },
      { type: 'reservation' as const, message: 'Cancellation: Customer Eleanor Vance canceled Table 1 reservation tomorrow.', severity: 'danger' as const },
      { type: 'table' as const, message: 'Table 5 changed status from Cleaning to Available. Ready to seat guests.', severity: 'success' as const },
      { type: 'staff' as const, message: 'Chef Alessandro Rossi initiated a menu catalog pricing audit.', severity: 'info' as const }
    ];

    const randomChoice = mockMsgs[Math.floor(Math.random() * mockMsgs.length)];
    logActivity(randomChoice.type, randomChoice.message, randomChoice.severity);
  };

  // Notifications drawer popover triggers
  const handleMarkActivityRead = (id: string) => {
    setActivities((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveData('activities', next);
      return next;
    });
  };

  const handleClearActivities = () => {
    setActivities([]);
    saveData('activities', []);
  };

  // 5. Dynamic Tab View Router Switcher
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            orders={orders}
            tables={tables}
            reservations={reservations}
            inventory={inventory}
            activities={activities}
            staff={staff}
            feedbacks={feedbacks}
            onAddFeedback={handleAddFeedback}
            onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
            onDeleteFeedback={handleDeleteFeedback}
            themeStyle={themeStyle}
            setTab={setTab}
          />
        );
      case 'tables':
        return (
          <TableManagementView
            tables={tables}
            onUpdateTable={handleUpdateTable}
            onSelectTableForOrder={handleSelectTableForOrder}
            themeStyle={themeStyle}
          />
        );
      case 'orders':
        return (
          <OrderManagementView
            menuItems={menuItems}
            tables={tables}
            preselectedTableNumber={preselectedTableNumber}
            onClearPreselectedTable={handleClearPreselectedTable}
            onAddOrder={handleAddOrder}
            themeStyle={themeStyle}
          />
        );
      case 'menu':
        return (
          <MenuManagementView
            menuItems={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            themeStyle={themeStyle}
            inventory={inventory}
          />
        );
      case 'kds':
        return (
          <KdsView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            themeStyle={themeStyle}
          />
        );
      case 'reservations':
        return (
          <ReservationView
            reservations={reservations}
            onAddReservation={handleAddReservation}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onSeatReservedGuest={handleSeatReservedGuest}
            themeStyle={themeStyle}
          />
        );
      case 'billing':
        return (
          <BillingView
            orders={orders}
            onPayOrder={handlePayOrder}
            themeStyle={themeStyle}
          />
        );
      case 'inventory':
        return (
          <InventoryView
            inventory={inventory}
            onRestockItem={handleRestockItem}
            onAddInventoryItem={handleAddInventoryItem}
            themeStyle={themeStyle}
          />
        );
      case 'staff':
        return (
          <StaffView
            staff={staff}
            orders={orders}
            onUpdateStaffAttendance={handleUpdateStaffAttendance}
            onUpdateStaffShiftTiming={handleUpdateStaffShiftTiming}
            onBulkUpdateStaffShifts={handleBulkUpdateStaffShifts}
            onAddStaffMember={handleAddStaffMember}
            themeStyle={themeStyle}
            currentUser={user}
          />
        );
      case 'reports':
        return (
          <ReportsView
            orders={orders}
            staff={staff}
            themeStyle={themeStyle}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onResetSystemData={handleResetSystemData}
            themeStyle={themeStyle}
          />
        );
      default:
        return (
          <div className="p-10 text-center text-gray-500">
            <Info className="w-8 h-8 mx-auto mb-2 text-gold-500" />
            <p className="text-sm">Page tab under culinary development.</p>
          </div>
        );
    }
  };

  // 6. Public menu bypass check (allows customer view without login)
  if (isPreviewPublicMenu) {
    return (
      <PublicMenuView
        menuItems={menuItems}
        settings={settings}
        themeStyle={themeStyle}
        onExitPreview={() => {
          setIsPreviewPublicMenu(false);
          const url = new URL(window.location.href);
          url.searchParams.delete('view');
          url.searchParams.delete('table');
          window.history.pushState({}, '', url.toString());
        }}
      />
    );
  }

  // 7. Gatekeeper Login check
  if (!user) {
    return <LoginView onLogin={handleLogin} settings={settings} />;
  }

  // Platinum vs Gold wrapper styling class
  const themeWrapperClass = themeStyle === 'gold' 
    ? 'text-white bg-[#050505] selection:bg-gold-500 selection:text-black theme-gold' 
    : 'text-white bg-[#050505] selection:bg-gold-500 selection:text-black theme-platinum';

  return (
    <div className={`flex min-h-screen overflow-hidden font-sans antialiased relative ${themeWrapperClass}`}>
      
      {/* Animated Mesh Background for Frosted Glass Theme */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        {themeStyle === 'gold' ? (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-orange-600/20 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-amber-600/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
          </>
        ) : (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
          </>
        )}
      </div>

      {/* 1. Left Sidebar Navigation Panel */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        user={user}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        settings={settings}
      />

      {/* 2. Right Main Working Console */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          user={user}
          onChangeRole={handleChangeRole}
          activities={activities}
          onMarkActivityRead={handleMarkActivityRead}
          onClearActivities={handleClearActivities}
          onSimulateActivity={handleSimulateActivity}
          themeStyle={themeStyle}
          setThemeStyle={setThemeStyle}
        />

        {/* Central tab display console viewport with Motion fade effects */}
        <main className="flex-1 overflow-y-auto relative z-10" id="main-viewport-console">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}

