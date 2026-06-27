/**
 * DineFlow RMS Types
 */

export type UserRole = 'Admin' | 'Manager' | 'Chef' | 'Waiter' | 'Cashier';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
}

export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  customerName?: string;
  guestsCount?: number;
}

export type MenuCategory = 'Starters' | 'Main Course' | 'Desserts' | 'Drinks' | 'Specials';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: MenuCategory;
  image: string;
  available: boolean;
  preparationTime: number; // in minutes
}

export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Served' | 'Paid' | 'Cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: number;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number; // percentage (e.g. 10)
  tax: number; // percentage (e.g. 8)
  grandTotal: number;
  status: OrderStatus;
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'Wallet';
  createdAt: string; // ISO string
  updatedAt: string;
  specialNotes?: string;
  waiterId?: string;
  waiterName?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  tablePreference: string; // e.g. "Table 4" or "Window Seat"
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string; // e.g. "kg", "liters", "units"
  supplier: string;
  expiryDate: string; // YYYY-MM-DD
  unitCost?: number; // Cost per unit (e.g., price per kg or liter)
}

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  contact: string;
  shiftTiming: string; // e.g. "08:00 AM - 04:00 PM"
  attendanceStatus: 'Present' | 'Absent' | 'On Leave';
  performanceRating: number; // 1 to 5
  image: string;
}

export interface LiveActivity {
  id: string;
  type: 'order' | 'reservation' | 'table' | 'inventory' | 'staff';
  message: string;
  time: string; // ISO string or relative time
  severity: 'info' | 'success' | 'warning' | 'danger';
}

export interface SystemSettings {
  restaurantName: string;
  currencySymbol: string;
  taxPercentage: number;
  defaultDiscountPercentage: number;
  enableSoundNotifications: boolean;
  kdsRefreshRate: number; // in seconds
  brandLogo?: string;
  primaryBrandColor?: string;
  secondaryBrandColor?: string;
}

export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  waiterId?: string;
  waiterName?: string;
  createdAt: string; // ISO string
  status: 'Pending' | 'Approved' | 'Archived';
  category?: 'Food Quality' | 'Service' | 'Ambiance' | 'Cleanliness' | 'General';
}

