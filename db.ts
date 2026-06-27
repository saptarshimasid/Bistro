import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_TABLES, 
  INITIAL_ORDERS, 
  INITIAL_RESERVATIONS, 
  INITIAL_INVENTORY, 
  INITIAL_STAFF, 
  INITIAL_ACTIVITIES, 
  DEFAULT_SETTINGS, 
  INITIAL_FEEDBACK 
} from './src/data/mockData';

dotenv.config();

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let pool: Pool | null = null;
const FALLBACK_FILE = path.join(process.cwd(), 'db_fallback.json');

// Initialize Pool if connection details exist
if (connectionString) {
  console.log("Connecting to PostgreSQL database using connection string...");
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('vercel-storage.com') || connectionString.includes('neon.tech') 
      ? { rejectUnauthorized: false } 
      : false
  });
} else {
  console.warn("No POSTGRES_URL or DATABASE_URL provided. Falling back to local JSON file database.");
}

interface FallbackData {
  menu: any[];
  tables: any[];
  orders: any[];
  reservations: any[];
  inventory: any[];
  staff: any[];
  activities: any[];
  settings: any;
  feedbacks: any[];
}

const getFallbackDefaults = (): FallbackData => ({
  menu: INITIAL_MENU_ITEMS,
  tables: INITIAL_TABLES,
  orders: INITIAL_ORDERS,
  reservations: INITIAL_RESERVATIONS,
  inventory: INITIAL_INVENTORY,
  staff: INITIAL_STAFF,
  activities: INITIAL_ACTIVITIES,
  settings: DEFAULT_SETTINGS,
  feedbacks: INITIAL_FEEDBACK,
});

function readFallbackFile(): FallbackData {
  if (!fs.existsSync(FALLBACK_FILE)) {
    const defaults = getFallbackDefaults();
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  try {
    const data = fs.readFileSync(FALLBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading fallback JSON database. Using defaults.", err);
    return getFallbackDefaults();
  }
}

function writeFallbackFile(data: FallbackData) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing fallback JSON database.", err);
  }
}

// Entity parsing helpers to ensure PostgreSQL numeric and date fields map directly to TypeScript types
function parseMenu(row: any) {
  return {
    ...row,
    price: Number(row.price),
    preparationTime: Number(row.preparationTime)
  };
}

function parseTable(row: any) {
  return {
    ...row,
    number: Number(row.number),
    capacity: Number(row.capacity),
    guestsCount: row.guestsCount != null ? Number(row.guestsCount) : undefined,
    currentOrderId: row.currentOrderId || undefined,
    customerName: row.customerName || undefined
  };
}

function parseOrder(row: any) {
  return {
    ...row,
    tableNumber: Number(row.tableNumber),
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    grandTotal: Number(row.grandTotal),
    specialNotes: row.specialNotes || undefined,
    waiterId: row.waiterId || undefined,
    waiterName: row.waiterName || undefined,
    paymentMethod: row.paymentMethod || undefined,
    customerName: row.customerName || undefined
  };
}

function parseReservation(row: any) {
  return {
    ...row,
    guests: Number(row.guests)
  };
}

function parseInventory(row: any) {
  return {
    ...row,
    currentStock: Number(row.currentStock),
    minimumStock: Number(row.minimumStock),
    unitCost: row.unitCost != null ? Number(row.unitCost) : undefined
  };
}

function parseStaff(row: any) {
  return {
    ...row,
    performanceRating: Number(row.performanceRating)
  };
}

function parseFeedback(row: any) {
  return {
    ...row,
    rating: Number(row.rating),
    waiterId: row.waiterId || undefined,
    waiterName: row.waiterName || undefined,
    category: row.category || undefined
  };
}

export async function initDb() {
  if (!pool) {
    readFallbackFile();
    console.log(`Fallback JSON database initialized at ${FALLBACK_FILE}`);
    return;
  }

  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
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

      CREATE TABLE IF NOT EXISTS tables (
        id VARCHAR(50) PRIMARY KEY,
        number INTEGER UNIQUE NOT NULL,
        capacity INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        "currentOrderId" VARCHAR(50),
        "customerName" VARCHAR(255),
        "guestsCount" INTEGER
      );

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

      CREATE TABLE IF NOT EXISTS live_activities (
        id VARCHAR(50) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        time VARCHAR(100) NOT NULL,
        severity VARCHAR(50) DEFAULT 'info'
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        id VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL
      );

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
    `);

    console.log("PostgreSQL Database tables verified/initialized.");

    // Seed tables if empty
    // 1. Menu items
    const menuCountRes = await client.query('SELECT COUNT(*) FROM menu_items');
    if (parseInt(menuCountRes.rows[0].count) === 0) {
      console.log("Seeding menu_items...");
      for (const item of INITIAL_MENU_ITEMS) {
        await client.query(
          `INSERT INTO menu_items (id, name, price, description, category, image, available, "preparationTime")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [item.id, item.name, item.price, item.description, item.category, item.image, item.available, item.preparationTime]
        );
      }
    }

    // 2. Tables
    const tablesCountRes = await client.query('SELECT COUNT(*) FROM tables');
    if (parseInt(tablesCountRes.rows[0].count) === 0) {
      console.log("Seeding tables...");
      for (const t of INITIAL_TABLES) {
        await client.query(
          `INSERT INTO tables (id, number, capacity, status, "currentOrderId", "customerName", "guestsCount")
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [t.id, t.number, t.capacity, t.status, t.currentOrderId || null, t.customerName || null, t.guestsCount || null]
        );
      }
    }

    // 3. Orders
    const ordersCountRes = await client.query('SELECT COUNT(*) FROM orders');
    if (parseInt(ordersCountRes.rows[0].count) === 0) {
      console.log("Seeding orders...");
      for (const o of INITIAL_ORDERS) {
        await client.query(
          `INSERT INTO orders (id, "orderNumber", "tableNumber", "customerName", items, subtotal, discount, tax, "grandTotal", status, "paymentMethod", "createdAt", "updatedAt", "specialNotes", "waiterId", "waiterName")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            o.id, o.orderNumber, o.tableNumber, o.customerName || null, JSON.stringify(o.items),
            o.subtotal, o.discount, o.tax, o.grandTotal, o.status, o.paymentMethod || null,
            o.createdAt, o.updatedAt, o.specialNotes || null, o.waiterId || null, o.waiterName || null
          ]
        );
      }
    }

    // 4. Reservations
    const resCountRes = await client.query('SELECT COUNT(*) FROM reservations');
    if (parseInt(resCountRes.rows[0].count) === 0) {
      console.log("Seeding reservations...");
      for (const r of INITIAL_RESERVATIONS) {
        await client.query(
          `INSERT INTO reservations (id, "customerName", phone, date, time, guests, "tablePreference", status, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [r.id, r.customerName, r.phone, r.date, r.time, r.guests, r.tablePreference, r.status, r.createdAt]
        );
      }
    }

    // 5. Inventory
    const invCountRes = await client.query('SELECT COUNT(*) FROM inventory_items');
    if (parseInt(invCountRes.rows[0].count) === 0) {
      console.log("Seeding inventory_items...");
      for (const i of INITIAL_INVENTORY) {
        await client.query(
          `INSERT INTO inventory_items (id, name, category, "currentStock", "minimumStock", unit, supplier, "expiryDate", "unitCost")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [i.id, i.name, i.category, i.currentStock, i.minimumStock, i.unit, i.supplier, i.expiryDate, i.unitCost || null]
        );
      }
    }

    // 6. Staff
    const staffCountRes = await client.query('SELECT COUNT(*) FROM staff_members');
    if (parseInt(staffCountRes.rows[0].count) === 0) {
      console.log("Seeding staff_members...");
      for (const s of INITIAL_STAFF) {
        await client.query(
          `INSERT INTO staff_members (id, name, role, contact, "shiftTiming", "attendanceStatus", "performanceRating", image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [s.id, s.name, s.role, s.contact, s.shiftTiming, s.attendanceStatus, s.performanceRating, s.image]
        );
      }
    }

    // 7. Live activities
    const actCountRes = await client.query('SELECT COUNT(*) FROM live_activities');
    if (parseInt(actCountRes.rows[0].count) === 0) {
      console.log("Seeding live_activities...");
      for (const a of INITIAL_ACTIVITIES) {
        await client.query(
          `INSERT INTO live_activities (id, type, message, time, severity)
           VALUES ($1, $2, $3, $4, $5)`,
          [a.id, a.type, a.message, a.time, a.severity]
        );
      }
    }

    // 8. Settings
    const settingsCountRes = await client.query('SELECT COUNT(*) FROM system_settings');
    if (parseInt(settingsCountRes.rows[0].count) === 0) {
      console.log("Seeding system_settings...");
      await client.query(
        `INSERT INTO system_settings (id, value) VALUES ($1, $2)`,
        ['current', JSON.stringify(DEFAULT_SETTINGS)]
      );
    }

    // 9. Feedback
    const fbCountRes = await client.query('SELECT COUNT(*) FROM customer_feedbacks');
    if (parseInt(fbCountRes.rows[0].count) === 0) {
      console.log("Seeding customer_feedbacks...");
      for (const f of INITIAL_FEEDBACK) {
        await client.query(
          `INSERT INTO customer_feedbacks (id, "customerName", rating, comment, "waiterId", "waiterName", "createdAt", status, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [f.id, f.customerName, f.rating, f.comment, f.waiterId || null, f.waiterName || null, f.createdAt, f.status, f.category || null]
        );
      }
    }

    console.log("PostgreSQL Database seeded successfully with default values.");

  } catch (err) {
    console.error("Error initializing and seeding PostgreSQL database:", err);
  } finally {
    client.release();
  }
}

export async function loadAllData() {
  if (!pool) {
    const fallback = readFallbackFile();
    return {
      menuItems: fallback.menu,
      tables: fallback.tables,
      orders: fallback.orders,
      reservations: fallback.reservations,
      inventory: fallback.inventory,
      staff: fallback.staff,
      activities: fallback.activities,
      settings: fallback.settings,
      feedbacks: fallback.feedbacks
    };
  }

  const client = await pool.connect();
  try {
    const menuItems = await client.query('SELECT * FROM menu_items');
    const tables = await client.query('SELECT * FROM tables ORDER BY number ASC');
    const orders = await client.query('SELECT * FROM orders ORDER BY "createdAt" DESC');
    const reservations = await client.query('SELECT * FROM reservations ORDER BY date ASC, time ASC');
    const inventory = await client.query('SELECT * FROM inventory_items');
    const staff = await client.query('SELECT * FROM staff_members');
    const activities = await client.query('SELECT * FROM live_activities ORDER BY time DESC');
    const settingsRes = await client.query('SELECT value FROM system_settings WHERE id = $1', ['current']);
    const feedbacks = await client.query('SELECT * FROM customer_feedbacks ORDER BY "createdAt" DESC');

    const settings = settingsRes.rows[0]?.value || DEFAULT_SETTINGS;

    return {
      menuItems: menuItems.rows.map(parseMenu),
      tables: tables.rows.map(parseTable),
      orders: orders.rows.map(parseOrder),
      reservations: reservations.rows.map(parseReservation),
      inventory: inventory.rows.map(parseInventory),
      staff: staff.rows.map(parseStaff),
      activities: activities.rows,
      settings,
      feedbacks: feedbacks.rows.map(parseFeedback)
    };
  } catch (err) {
    console.error("Error loading data from PostgreSQL, falling back to local file:", err);
    const fallback = readFallbackFile();
    return {
      menuItems: fallback.menu,
      tables: fallback.tables,
      orders: fallback.orders,
      reservations: fallback.reservations,
      inventory: fallback.inventory,
      staff: fallback.staff,
      activities: fallback.activities,
      settings: fallback.settings,
      feedbacks: fallback.feedbacks
    };
  } finally {
    client.release();
  }
}

export async function saveDataKey(key: string, data: any) {
  if (!pool) {
    const fallback = readFallbackFile();
    (fallback as any)[key] = data;
    writeFallbackFile(fallback);
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (key === 'menu') {
      await client.query('DELETE FROM menu_items');
      for (const item of data) {
        await client.query(
          `INSERT INTO menu_items (id, name, price, description, category, image, available, "preparationTime")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [item.id, item.name, item.price, item.description, item.category, item.image, item.available, item.preparationTime]
        );
      }
    } else if (key === 'tables') {
      await client.query('DELETE FROM tables');
      for (const t of data) {
        await client.query(
          `INSERT INTO tables (id, number, capacity, status, "currentOrderId", "customerName", "guestsCount")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [t.id, t.number, t.capacity, t.status, t.currentOrderId || null, t.customerName || null, t.guestsCount || null]
        );
      }
    } else if (key === 'orders') {
      await client.query('DELETE FROM orders');
      for (const o of data) {
        await client.query(
          `INSERT INTO orders (id, "orderNumber", "tableNumber", "customerName", items, subtotal, discount, tax, "grandTotal", status, "paymentMethod", "createdAt", "updatedAt", "specialNotes", "waiterId", "waiterName")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO NOTHING`,
          [
            o.id, o.orderNumber, o.tableNumber, o.customerName || null, JSON.stringify(o.items),
            o.subtotal, o.discount, o.tax, o.grandTotal, o.status, o.paymentMethod || null,
            o.createdAt, o.updatedAt, o.specialNotes || null, o.waiterId || null, o.waiterName || null
          ]
        );
      }
    } else if (key === 'reservations') {
      await client.query('DELETE FROM reservations');
      for (const r of data) {
        await client.query(
          `INSERT INTO reservations (id, "customerName", phone, date, time, guests, "tablePreference", status, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [r.id, r.customerName, r.phone, r.date, r.time, r.guests, r.tablePreference, r.status, r.createdAt]
        );
      }
    } else if (key === 'inventory') {
      await client.query('DELETE FROM inventory_items');
      for (const i of data) {
        await client.query(
          `INSERT INTO inventory_items (id, name, category, "currentStock", "minimumStock", unit, supplier, "expiryDate", "unitCost")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [i.id, i.name, i.category, i.currentStock, i.minimumStock, i.unit, i.supplier, i.expiryDate, i.unitCost || null]
        );
      }
    } else if (key === 'staff') {
      await client.query('DELETE FROM staff_members');
      for (const s of data) {
        await client.query(
          `INSERT INTO staff_members (id, name, role, contact, "shiftTiming", "attendanceStatus", "performanceRating", image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [s.id, s.name, s.role, s.contact, s.shiftTiming, s.attendanceStatus, s.performanceRating, s.image]
        );
      }
    } else if (key === 'activities') {
      await client.query('DELETE FROM live_activities');
      for (const a of data) {
        await client.query(
          `INSERT INTO live_activities (id, type, message, time, severity)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [a.id, a.type, a.message, a.time, a.severity]
        );
      }
    } else if (key === 'settings') {
      await client.query('DELETE FROM system_settings');
      await client.query(
        `INSERT INTO system_settings (id, value) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET value = $2`,
        ['current', JSON.stringify(data)]
      );
    } else if (key === 'feedbacks') {
      await client.query('DELETE FROM customer_feedbacks');
      for (const f of data) {
        await client.query(
          `INSERT INTO customer_feedbacks (id, "customerName", rating, comment, "waiterId", "waiterName", "createdAt", status, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [f.id, f.customerName, f.rating, f.comment, f.waiterId || null, f.waiterName || null, f.createdAt, f.status, f.category || null]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error saving key ${key} to PostgreSQL database:`, err);
    throw err;
  } finally {
    client.release();
  }
}
