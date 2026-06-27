var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"));
var import_path2 = __toESM(require("path"));
var import_genai = require("@google/genai");
var import_dotenv2 = __toESM(require("dotenv"));

// db.ts
var import_pg = require("pg");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_dotenv = __toESM(require("dotenv"));
function readDefaultsJson() {
  try {
    const filePath = import_path.default.join(process.cwd(), "src/data/mockDataDefaults.json");
    const content = import_fs.default.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Failed to read mockDataDefaults.json, returning empty defaults:", err);
    return {
      menu: [],
      tables: [],
      orders: [],
      reservations: [],
      inventory: [],
      staff: [],
      activities: [],
      settings: {},
      feedback: []
    };
  }
}
var defaults = readDefaultsJson();
import_dotenv.default.config();
var pool = null;
var FALLBACK_FILE = import_path.default.join(process.cwd(), "db_fallback.json");
function getPool() {
  if (pool) return pool;
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("No POSTGRES_URL or DATABASE_URL provided. Falling back to local JSON file database.");
    return null;
  }
  try {
    console.log("Connecting to PostgreSQL database using connection string...");
    pool = new import_pg.Pool({
      connectionString,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5e3,
      idleTimeoutMillis: 1e4
    });
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client or pool:", err);
      pool = null;
    });
    return pool;
  } catch (poolErr) {
    console.error("Failed to initialize PostgreSQL pool:", poolErr);
    pool = null;
    return null;
  }
}
var getFallbackDefaults = () => ({
  menu: defaults.menu,
  tables: defaults.tables,
  orders: defaults.orders,
  reservations: defaults.reservations,
  inventory: defaults.inventory,
  staff: defaults.staff,
  activities: defaults.activities,
  settings: defaults.settings,
  feedbacks: defaults.feedback
});
function readFallbackFile() {
  if (!import_fs.default.existsSync(FALLBACK_FILE)) {
    const defaults2 = getFallbackDefaults();
    try {
      import_fs.default.writeFileSync(FALLBACK_FILE, JSON.stringify(defaults2, null, 2));
    } catch (writeErr) {
      console.warn("Failed to write fallback default file (possibly read-only filesystem):", writeErr);
    }
    return defaults2;
  }
  try {
    const data = import_fs.default.readFileSync(FALLBACK_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading fallback JSON database. Using defaults.", err);
    return getFallbackDefaults();
  }
}
function writeFallbackFile(data) {
  try {
    import_fs.default.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing fallback JSON database.", err);
  }
}
function parseMenu(row) {
  const preparationTime = row.preparationTime !== void 0 ? row.preparationTime : row.preparationtime;
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    description: row.description,
    category: row.category,
    image: row.image,
    available: row.available,
    preparationTime: Number(preparationTime)
  };
}
function parseTable(row) {
  const currentOrderId = row.currentOrderId !== void 0 ? row.currentOrderId : row.currentorderid;
  const customerName = row.customerName !== void 0 ? row.customerName : row.customername;
  const guestsCount = row.guestsCount !== void 0 ? row.guestsCount : row.guestscount;
  return {
    id: row.id,
    number: Number(row.number),
    capacity: Number(row.capacity),
    status: row.status,
    currentOrderId: currentOrderId || void 0,
    customerName: customerName || void 0,
    guestsCount: guestsCount != null ? Number(guestsCount) : void 0
  };
}
function parseOrder(row) {
  const orderNumber = row.orderNumber !== void 0 ? row.orderNumber : row.ordernumber;
  const tableNumber = row.tableNumber !== void 0 ? row.tableNumber : row.tablenumber;
  const customerName = row.customerName !== void 0 ? row.customerName : row.customername;
  const grandTotal = row.grandTotal !== void 0 ? row.grandTotal : row.grandtotal;
  const paymentMethod = row.paymentMethod !== void 0 ? row.paymentMethod : row.paymentmethod;
  const createdAt = row.createdAt !== void 0 ? row.createdAt : row.createdat;
  const updatedAt = row.updatedAt !== void 0 ? row.updatedAt : row.updatedat;
  const specialNotes = row.specialNotes !== void 0 ? row.specialNotes : row.specialnotes;
  const waiterId = row.waiterId !== void 0 ? row.waiterId : row.waiterid;
  const waiterName = row.waiterName !== void 0 ? row.waiterName : row.waitername;
  return {
    id: row.id,
    orderNumber,
    tableNumber: Number(tableNumber),
    customerName: customerName || void 0,
    items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    grandTotal: Number(grandTotal),
    status: row.status,
    paymentMethod: paymentMethod || void 0,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    specialNotes: specialNotes || void 0,
    waiterId: waiterId || void 0,
    waiterName: waiterName || void 0
  };
}
function parseReservation(row) {
  const customerName = row.customerName !== void 0 ? row.customerName : row.customername;
  const tablePreference = row.tablePreference !== void 0 ? row.tablePreference : row.tablepreference;
  const createdAt = row.createdAt !== void 0 ? row.createdAt : row.createdat;
  return {
    id: row.id,
    customerName,
    phone: row.phone,
    date: row.date,
    time: row.time,
    guests: Number(row.guests),
    tablePreference: tablePreference || void 0,
    status: row.status,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt
  };
}
function parseInventory(row) {
  const currentStock = row.currentStock !== void 0 ? row.currentStock : row.currentstock;
  const minimumStock = row.minimumStock !== void 0 ? row.minimumStock : row.minimumstock;
  const expiryDate = row.expiryDate !== void 0 ? row.expiryDate : row.expirydate;
  const unitCost = row.unitCost !== void 0 ? row.unitCost : row.unitcost;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    currentStock: Number(currentStock),
    minimumStock: Number(minimumStock),
    unit: row.unit,
    supplier: row.supplier,
    expiryDate,
    unitCost: unitCost != null ? Number(unitCost) : void 0
  };
}
function parseStaff(row) {
  const shiftTiming = row.shiftTiming !== void 0 ? row.shiftTiming : row.shifttiming;
  const attendanceStatus = row.attendanceStatus !== void 0 ? row.attendanceStatus : row.attendancestatus;
  const performanceRating = row.performanceRating !== void 0 ? row.performanceRating : row.performancerating;
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    contact: row.contact,
    shiftTiming: shiftTiming || "",
    attendanceStatus: attendanceStatus || "Present",
    performanceRating: Number(performanceRating),
    image: row.image
  };
}
function parseFeedback(row) {
  const customerName = row.customerName !== void 0 ? row.customerName : row.customername;
  const waiterId = row.waiterId !== void 0 ? row.waiterId : row.waiterid;
  const waiterName = row.waiterName !== void 0 ? row.waiterName : row.waitername;
  const createdAt = row.createdAt !== void 0 ? row.createdAt : row.createdat;
  return {
    id: row.id,
    customerName,
    rating: Number(row.rating),
    comment: row.comment,
    waiterId: waiterId || void 0,
    waiterName: waiterName || void 0,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    status: row.status,
    category: row.category || void 0
  };
}
async function initDb() {
  const activePool = getPool();
  if (!activePool) {
    readFallbackFile();
    console.log(`Fallback JSON database initialized at ${FALLBACK_FILE}`);
    return;
  }
  const client = await activePool.connect();
  client.on("error", (err) => {
    console.error("Database client error during initDb:", err);
  });
  try {
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
    const menuCountRes = await client.query("SELECT COUNT(*) FROM menu_items");
    if (parseInt(menuCountRes.rows[0].count) === 0) {
      console.log("Seeding menu_items...");
      for (const item of defaults.menu) {
        await client.query(
          `INSERT INTO menu_items (id, name, price, description, category, image, available, "preparationTime")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [item.id, item.name, item.price, item.description, item.category, item.image, item.available, item.preparationTime]
        );
      }
    }
    const tablesCountRes = await client.query("SELECT COUNT(*) FROM tables");
    if (parseInt(tablesCountRes.rows[0].count) === 0) {
      console.log("Seeding tables...");
      for (const t of defaults.tables) {
        await client.query(
          `INSERT INTO tables (id, number, capacity, status, "currentOrderId", "customerName", "guestsCount")
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [t.id, t.number, t.capacity, t.status, t.currentOrderId || null, t.customerName || null, t.guestsCount || null]
        );
      }
    }
    const ordersCountRes = await client.query("SELECT COUNT(*) FROM orders");
    if (parseInt(ordersCountRes.rows[0].count) === 0) {
      console.log("Seeding orders...");
      for (const o of defaults.orders) {
        await client.query(
          `INSERT INTO orders (id, "orderNumber", "tableNumber", "customerName", items, subtotal, discount, tax, "grandTotal", status, "paymentMethod", "createdAt", "updatedAt", "specialNotes", "waiterId", "waiterName")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            o.id,
            o.orderNumber,
            o.tableNumber,
            o.customerName || null,
            JSON.stringify(o.items),
            o.subtotal,
            o.discount,
            o.tax,
            o.grandTotal,
            o.status,
            o.paymentMethod || null,
            o.createdAt,
            o.updatedAt,
            o.specialNotes || null,
            o.waiterId || null,
            o.waiterName || null
          ]
        );
      }
    }
    const resCountRes = await client.query("SELECT COUNT(*) FROM reservations");
    if (parseInt(resCountRes.rows[0].count) === 0) {
      console.log("Seeding reservations...");
      for (const r of defaults.reservations) {
        await client.query(
          `INSERT INTO reservations (id, "customerName", phone, date, time, guests, "tablePreference", status, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [r.id, r.customerName, r.phone, r.date, r.time, r.guests, r.tablePreference, r.status, r.createdAt]
        );
      }
    }
    const invCountRes = await client.query("SELECT COUNT(*) FROM inventory_items");
    if (parseInt(invCountRes.rows[0].count) === 0) {
      console.log("Seeding inventory_items...");
      for (const i of defaults.inventory) {
        await client.query(
          `INSERT INTO inventory_items (id, name, category, "currentStock", "minimumStock", unit, supplier, "expiryDate", "unitCost")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [i.id, i.name, i.category, i.currentStock, i.minimumStock, i.unit, i.supplier, i.expiryDate, i.unitCost || null]
        );
      }
    }
    const staffCountRes = await client.query("SELECT COUNT(*) FROM staff_members");
    if (parseInt(staffCountRes.rows[0].count) === 0) {
      console.log("Seeding staff_members...");
      for (const s of defaults.staff) {
        await client.query(
          `INSERT INTO staff_members (id, name, role, contact, "shiftTiming", "attendanceStatus", "performanceRating", image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [s.id, s.name, s.role, s.contact, s.shiftTiming, s.attendanceStatus, s.performanceRating, s.image]
        );
      }
    }
    const actCountRes = await client.query("SELECT COUNT(*) FROM live_activities");
    if (parseInt(actCountRes.rows[0].count) === 0) {
      console.log("Seeding live_activities...");
      for (const a of defaults.activities) {
        await client.query(
          `INSERT INTO live_activities (id, type, message, time, severity)
           VALUES ($1, $2, $3, $4, $5)`,
          [a.id, a.type, a.message, a.time, a.severity]
        );
      }
    }
    const settingsCountRes = await client.query("SELECT COUNT(*) FROM system_settings");
    if (parseInt(settingsCountRes.rows[0].count) === 0) {
      console.log("Seeding system_settings...");
      await client.query(
        `INSERT INTO system_settings (id, value) VALUES ($1, $2)`,
        ["current", JSON.stringify(defaults.settings)]
      );
    }
    const fbCountRes = await client.query("SELECT COUNT(*) FROM customer_feedbacks");
    if (parseInt(fbCountRes.rows[0].count) === 0) {
      console.log("Seeding customer_feedbacks...");
      for (const f of defaults.feedback) {
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
async function loadAllData() {
  const activePool = getPool();
  if (!activePool) {
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
  let client;
  try {
    client = await activePool.connect();
    client.on("error", (err) => {
      console.error("Database client error during loadAllData:", err);
    });
  } catch (connErr) {
    console.error("Error connecting to database, falling back to local file:", connErr);
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
  try {
    const menuItems = await client.query("SELECT * FROM menu_items");
    const tables = await client.query("SELECT * FROM tables ORDER BY number ASC");
    const orders = await client.query('SELECT * FROM orders ORDER BY "createdAt" DESC');
    const reservations = await client.query("SELECT * FROM reservations ORDER BY date ASC, time ASC");
    const inventory = await client.query("SELECT * FROM inventory_items");
    const staff = await client.query("SELECT * FROM staff_members");
    const activities = await client.query("SELECT * FROM live_activities ORDER BY time DESC");
    const settingsRes = await client.query("SELECT value FROM system_settings WHERE id = $1", ["current"]);
    const feedbacks = await client.query('SELECT * FROM customer_feedbacks ORDER BY "createdAt" DESC');
    const settings = settingsRes.rows[0]?.value || defaults.settings;
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
async function saveDataKey(key, data) {
  const activePool = getPool();
  if (!activePool) {
    const fallback = readFallbackFile();
    fallback[key] = data;
    writeFallbackFile(fallback);
    return;
  }
  const client = await activePool.connect();
  client.on("error", (err) => {
    console.error("Database client error during saveDataKey:", err);
  });
  try {
    await client.query("BEGIN");
    if (key === "menu") {
      await client.query("DELETE FROM menu_items");
      for (const item of data) {
        await client.query(
          `INSERT INTO menu_items (id, name, price, description, category, image, available, "preparationTime")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [item.id, item.name, item.price, item.description, item.category, item.image, item.available, item.preparationTime]
        );
      }
    } else if (key === "tables") {
      await client.query("DELETE FROM tables");
      for (const t of data) {
        await client.query(
          `INSERT INTO tables (id, number, capacity, status, "currentOrderId", "customerName", "guestsCount")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [t.id, t.number, t.capacity, t.status, t.currentOrderId || null, t.customerName || null, t.guestsCount || null]
        );
      }
    } else if (key === "orders") {
      await client.query("DELETE FROM orders");
      for (const o of data) {
        await client.query(
          `INSERT INTO orders (id, "orderNumber", "tableNumber", "customerName", items, subtotal, discount, tax, "grandTotal", status, "paymentMethod", "createdAt", "updatedAt", "specialNotes", "waiterId", "waiterName")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO NOTHING`,
          [
            o.id,
            o.orderNumber,
            o.tableNumber,
            o.customerName || null,
            JSON.stringify(o.items),
            o.subtotal,
            o.discount,
            o.tax,
            o.grandTotal,
            o.status,
            o.paymentMethod || null,
            o.createdAt,
            o.updatedAt,
            o.specialNotes || null,
            o.waiterId || null,
            o.waiterName || null
          ]
        );
      }
    } else if (key === "reservations") {
      await client.query("DELETE FROM reservations");
      for (const r of data) {
        await client.query(
          `INSERT INTO reservations (id, "customerName", phone, date, time, guests, "tablePreference", status, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [r.id, r.customerName, r.phone, r.date, r.time, r.guests, r.tablePreference, r.status, r.createdAt]
        );
      }
    } else if (key === "inventory") {
      await client.query("DELETE FROM inventory_items");
      for (const i of data) {
        await client.query(
          `INSERT INTO inventory_items (id, name, category, "currentStock", "minimumStock", unit, supplier, "expiryDate", "unitCost")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [i.id, i.name, i.category, i.currentStock, i.minimumStock, i.unit, i.supplier, i.expiryDate, i.unitCost || null]
        );
      }
    } else if (key === "staff") {
      await client.query("DELETE FROM staff_members");
      for (const s of data) {
        await client.query(
          `INSERT INTO staff_members (id, name, role, contact, "shiftTiming", "attendanceStatus", "performanceRating", image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [s.id, s.name, s.role, s.contact, s.shiftTiming, s.attendanceStatus, s.performanceRating, s.image]
        );
      }
    } else if (key === "activities") {
      await client.query("DELETE FROM live_activities");
      for (const a of data) {
        await client.query(
          `INSERT INTO live_activities (id, type, message, time, severity)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [a.id, a.type, a.message, a.time, a.severity]
        );
      }
    } else if (key === "settings") {
      await client.query("DELETE FROM system_settings");
      await client.query(
        `INSERT INTO system_settings (id, value) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET value = $2`,
        ["current", JSON.stringify(data)]
      );
    } else if (key === "feedbacks") {
      await client.query("DELETE FROM customer_feedbacks");
      for (const f of data) {
        await client.query(
          `INSERT INTO customer_feedbacks (id, "customerName", rating, comment, "waiterId", "waiterName", "createdAt", status, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [f.id, f.customerName, f.rating, f.comment, f.waiterId || null, f.waiterName || null, f.createdAt, f.status, f.category || null]
        );
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Error saving key ${key} to PostgreSQL database:`, err);
    throw err;
  } finally {
    client.release();
  }
}
async function resetDb() {
  const activePool = getPool();
  if (!activePool) {
    const defaults2 = getFallbackDefaults();
    writeFallbackFile(defaults2);
    console.log("Fallback JSON database reset to default values.");
    return;
  }
  const client = await activePool.connect();
  client.on("error", (err) => {
    console.error("Database client error during resetDb:", err);
  });
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM menu_items");
    await client.query("DELETE FROM tables");
    await client.query("DELETE FROM orders");
    await client.query("DELETE FROM reservations");
    await client.query("DELETE FROM inventory_items");
    await client.query("DELETE FROM staff_members");
    await client.query("DELETE FROM live_activities");
    await client.query("DELETE FROM system_settings");
    await client.query("DELETE FROM customer_feedbacks");
    await client.query("COMMIT");
    console.log("Database cleared for reset.");
    await initDb();
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error resetting database:", err);
    throw err;
  } finally {
    client.release();
  }
}

// server.ts
import_dotenv2.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined.");
  }
  return new import_genai.GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
app.post("/api/ai/auto-price", async (req, res) => {
  try {
    const {
      menuItemName,
      description,
      category,
      selectedIngredients,
      profitMargin,
      availableInventory
    } = req.body;
    if (!menuItemName) {
      return res.status(400).json({ error: "Menu item name is required" });
    }
    const marginValue = profitMargin || 70;
    const ai = getGeminiClient();
    let prompt = "";
    if (selectedIngredients && selectedIngredients.length > 0) {
      prompt = `
        You are a restaurant pricing consultant.
        Calculate the optimal menu price for the following menu item:
        - Name: "${menuItemName}"
        - Category: "${category}"
        - Description: "${description || "N/A"}"
        - Desired Profit Margin: ${marginValue}% (meaning raw cost should be ${100 - marginValue}% of the retail price)

        The user has selected the following specific ingredients from the inventory:
        ${JSON.stringify(selectedIngredients, null, 2)}

        Calculate the total cost of these ingredients based on their quantities and unit costs.
        Then, calculate the suggested retail price that achieves the desired ${marginValue}% profit margin.
        Formula: Suggested Price = Total Ingredient Cost / (1 - (Desired Margin / 100))
        
        Provide the calculation, cost contributions, and a clear pricing rationale.
      `;
    } else {
      prompt = `
        You are an expert culinary operations and pricing consultant.
        A chef wants to add a new menu item:
        - Name: "${menuItemName}"
        - Category: "${category}"
        - Description: "${description || "N/A"}"
        - Desired Profit Margin: ${marginValue}% (meaning raw cost should be ${100 - marginValue}% of the retail price)

        Here is the restaurant's active raw stock inventory:
        ${JSON.stringify(availableInventory || [], null, 2)}

        Tasks:
        1. Identify which inventory ingredients from the list are likely used in this recipe.
        2. Estimate standard, realistic portion sizes/quantities of these ingredients for a single serving.
        3. Retrieve their corresponding "unitCost" to find the total food cost.
        4. If some standard ingredients are missing from the inventory list, use realistic market prices for them, but mark them as "estimated/off-inventory" items.
        5. Calculate the suggested retail price to meet the ${marginValue}% profit margin.
           Formula: Suggested Price = Total Ingredient Cost / (1 - (Desired Margin / 100))
        6. Return a comprehensive breakdown of the costs and the reasoning.
      `;
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional restaurant revenue manager and executive chef. You specialize in menu engineering, costing, and strategic pricing. Always respond with valid JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["suggestedPrice", "totalCostOfIngredients", "calculatedMargin", "ingredientsUsed", "reasoning"],
          properties: {
            suggestedPrice: {
              type: import_genai.Type.NUMBER,
              description: "The suggested optimal selling price for the menu item"
            },
            totalCostOfIngredients: {
              type: import_genai.Type.NUMBER,
              description: "The total raw ingredient cost for a single portion"
            },
            calculatedMargin: {
              type: import_genai.Type.NUMBER,
              description: "The exact profit margin achieved (equal to the desired profit margin)"
            },
            ingredientsUsed: {
              type: import_genai.Type.ARRAY,
              description: "List of ingredients used in the cost breakdown",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["name", "quantityNeeded", "unit", "costContribution", "isFromInventory"],
                properties: {
                  name: { type: import_genai.Type.STRING },
                  quantityNeeded: { type: import_genai.Type.NUMBER, description: "Quantity used per serving" },
                  unit: { type: import_genai.Type.STRING, description: "E.g., kg, unit, liter" },
                  costContribution: { type: import_genai.Type.NUMBER, description: "Total cost of this ingredient in the serving" },
                  isFromInventory: { type: import_genai.Type.BOOLEAN, description: "Whether this ingredient was matched from the active inventory list" }
                }
              }
            },
            reasoning: {
              type: import_genai.Type.STRING,
              description: "Detailed, chef-professional breakdown of the recommended price, portion assumptions, and profitability"
            }
          }
        }
      }
    });
    const resultText = response.text || "{}";
    const pricingData = JSON.parse(resultText.trim());
    res.json(pricingData);
  } catch (error) {
    console.error("AI Auto-Price Error:", error);
    res.status(500).json({
      error: "Failed to generate price suggestion. Please ensure GEMINI_API_KEY is configured properly.",
      details: error?.message || String(error)
    });
  }
});
app.post("/api/ai/smart-schedule", async (req, res) => {
  try {
    const { staff, orders } = req.body;
    if (!staff || !Array.isArray(staff)) {
      return res.status(400).json({ error: "Staff list is required and must be an array" });
    }
    const hourlyOrders = {};
    const dailyOrders = {};
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let validOrdersCount = 0;
    (orders || []).forEach((o) => {
      if (!o.createdAt || o.status === "Cancelled") return;
      try {
        const d = new Date(o.createdAt);
        const hour = d.getHours();
        const hourLabel = `${String(hour).padStart(2, "0")}:00`;
        hourlyOrders[hourLabel] = (hourlyOrders[hourLabel] || 0) + 1;
        const day = weekdays[d.getDay()];
        dailyOrders[day] = (dailyOrders[day] || 0) + 1;
        validOrdersCount++;
      } catch {
      }
    });
    const ai = getGeminiClient();
    const prompt = `
      You are an expert restaurant operations planner and labor optimization consultant.
      Your task is to analyze historical order volume peaks and automatically design an optimal shift schedule for our staff roster.

      Here is the historical order data parsed from our active ReportsView:
      - Total completed orders analyzed: ${validOrdersCount}
      - Daily order counts: ${JSON.stringify(dailyOrders)}
      - Hourly order counts: ${JSON.stringify(hourlyOrders)}

      If the above distribution has low data points, assume standard fine-dining peaks:
      - Lunch Rush: 11:30 AM - 02:30 PM (High demand, high ticket throughput)
      - Dinner Rush: 05:30 PM - 09:30 PM (Critical demand, premium Wagyu/Steak focus, requires top Chefs & Waiters)
      - Late Lounge: 09:30 PM - 12:00 AM (Medium demand, high cocktail/beverage focus)

      Here is our active staff roster:
      ${JSON.stringify(staff, null, 2)}

      Tasks:
      1. Predict 3 major peak intensity periods based on the order timings.
      2. Recommend an optimal shift timing assignment for each employee in the staff roster. The standard shifts to choose from are:
         - "08:00 AM - 04:00 PM" (Morning Shift: heavy kitchen prep, lunch service)
         - "11:00 AM - 07:00 PM" (Day Shift: covers both lunch and dinner transition)
         - "04:00 PM - 12:00 AM" (Evening Shift: heavy dinner rush, closing)
         - "12:00 PM - 10:00 PM" (Double/Split/Chef Shift: coverage for entire high-intensity core day)
         Or suggest a custom shift if it fits their role better!
      3. Strategically place higher-rated employees (performanceRating) and align staff counts with the peak periods (e.g. more waiters and chefs during the Dinner Rush than the Morning shift).
      4. Compute a capacity coverage score for each shift (Morning, Day, Evening).
      5. Provide an executive summary of your labor strategy.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional hospitality consultant and senior restaurant operations scheduler. Always respond with valid JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["predictedPeaks", "scheduleSuggestions", "capacityCoverage", "executiveSummary"],
          properties: {
            predictedPeaks: {
              type: import_genai.Type.ARRAY,
              description: "The identified high-volume peak times predicted from reports analytics",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["timeRange", "intensity", "description"],
                properties: {
                  timeRange: { type: import_genai.Type.STRING, description: "e.g. 12:00 PM - 02:00 PM" },
                  intensity: { type: import_genai.Type.STRING, description: "Low, Medium, High, Critical" },
                  description: { type: import_genai.Type.STRING, description: "What is happening during this peak (e.g. Lunch rush, cocktail hours)" }
                }
              }
            },
            scheduleSuggestions: {
              type: import_genai.Type.ARRAY,
              description: "The suggested shift assignments for each member of the staff roster",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["staffId", "staffName", "role", "suggestedShift", "reason"],
                properties: {
                  staffId: { type: import_genai.Type.STRING },
                  staffName: { type: import_genai.Type.STRING },
                  role: { type: import_genai.Type.STRING },
                  suggestedShift: { type: import_genai.Type.STRING, description: "e.g. 04:00 PM - 12:00 AM" },
                  reason: { type: import_genai.Type.STRING, description: "Specific, professional reason for this assignment based on role and rating" }
                }
              }
            },
            capacityCoverage: {
              type: import_genai.Type.ARRAY,
              description: "The analyzed coverage levels across standard shift blocks",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["shiftName", "staffCount", "coverageLevel"],
                properties: {
                  shiftName: { type: import_genai.Type.STRING, description: "e.g. Morning, Day, Evening" },
                  staffCount: { type: import_genai.Type.NUMBER, description: "Number of staff members assigned to this shift" },
                  coverageLevel: { type: import_genai.Type.STRING, description: "e.g. Understaffed, Optimal, Robust" }
                }
              }
            },
            executiveSummary: {
              type: import_genai.Type.STRING,
              description: "Strategic overview explanation of how this layout maximizes profit, speed, and lowers cost"
            }
          }
        }
      }
    });
    const resultText = response.text || "{}";
    const scheduleData = JSON.parse(resultText.trim());
    res.json(scheduleData);
  } catch (error) {
    console.error("AI Smart Scheduling Error:", error);
    res.status(500).json({
      error: "Failed to generate smart schedule recommendations. Please verify your GEMINI_API_KEY is configured.",
      details: error?.message || String(error)
    });
  }
});
app.get("/api/data", async (req, res) => {
  try {
    const data = await loadAllData();
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.json(data);
  } catch (error) {
    console.error("Failed to load restaurant data:", error);
    res.status(500).json({ error: "Failed to load restaurant data", details: error?.message });
  }
});
app.post("/api/save", async (req, res) => {
  const { key, data } = req.body;
  try {
    if (!key) {
      return res.status(400).json({ error: "Key is required" });
    }
    await saveDataKey(key, data);
    res.json({ success: true, message: `Successfully saved ${key} data.` });
  } catch (error) {
    console.error(`Failed to save data for key ${key}:`, error);
    res.status(500).json({ error: `Failed to save data for key ${key}`, details: error?.message });
  }
});
app.post("/api/reset", async (req, res) => {
  try {
    await resetDb();
    res.json({ success: true, message: "System database successfully reset to default values." });
  } catch (error) {
    console.error("Failed to reset database:", error);
    res.status(500).json({ error: "Failed to reset database", details: error?.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
    console.log("Serving compiled production assets.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bistro server listening on host 0.0.0.0 port ${PORT}`);
  });
}
var server_default = app;
initDb().catch((err) => console.error("Database initialization failed:", err));
if (!process.env.VERCEL) {
  startServer();
}

// api/index.ts
var handler = (req, res) => {
  return new Promise((resolve) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    server_default(req, res);
  });
};
module.exports = handler;
