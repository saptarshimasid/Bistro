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

// api/test-debug.ts
var handler = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const data = await loadAllData();
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (error) {
    res.setHeader("Content-Type", "text/plain");
    res.status(500).send(`Crash: ${error.message}
${error.stack}`);
  }
};
module.exports = handler;
