-- DineFlow Database Schema (PostgreSQL)

-- 1. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image TEXT,
  available BOOLEAN DEFAULT true,
  "preparationTime" INTEGER DEFAULT 10
);

-- 2. Tables configuration
CREATE TABLE IF NOT EXISTS tables (
  id VARCHAR(50) PRIMARY KEY,
  number INTEGER UNIQUE NOT NULL,
  capacity INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  "currentOrderId" VARCHAR(50),
  "customerName" VARCHAR(255),
  "guestsCount" INTEGER
);

-- 3. Orders & Items
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
  "tableNumber" INTEGER NOT NULL,
  "customerName" VARCHAR(255),
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(5, 2) DEFAULT 0,
  tax NUMERIC(5, 2) DEFAULT 8,
  "grandTotal" NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  "paymentMethod" VARCHAR(50),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "specialNotes" TEXT,
  "waiterId" VARCHAR(50),
  "waiterName" VARCHAR(255)
);

-- 4. Bookings & Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(50) PRIMARY KEY,
  "customerName" VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  date VARCHAR(20) NOT NULL,
  time VARCHAR(20) NOT NULL,
  guests INTEGER NOT NULL,
  "tablePreference" VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Pending',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  "currentStock" NUMERIC(10, 2) NOT NULL,
  "minimumStock" NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  supplier VARCHAR(255),
  "expiryDate" VARCHAR(20),
  "unitCost" NUMERIC(10, 2)
);

-- 6. Staff Roster & Shifts
CREATE TABLE IF NOT EXISTS staff_members (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  contact VARCHAR(100),
  "shiftTiming" VARCHAR(100),
  "attendanceStatus" VARCHAR(50) DEFAULT 'Present',
  "performanceRating" NUMERIC(3, 2) DEFAULT 5.0,
  image TEXT
);

-- 7. Live Activity Logs
CREATE TABLE IF NOT EXISTS live_activities (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  time VARCHAR(100) NOT NULL,
  severity VARCHAR(50) DEFAULT 'info'
);

-- 8. Restaurant Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id VARCHAR(50) PRIMARY KEY,
  value JSONB NOT NULL
);

-- 9. Customer Feedback
CREATE TABLE IF NOT EXISTS customer_feedbacks (
  id VARCHAR(50) PRIMARY KEY,
  "customerName" VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  "waiterId" VARCHAR(50),
  "waiterName" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pending',
  category VARCHAR(100)
);
