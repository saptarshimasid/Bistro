import { getPool } from "../db";

function parseMenu(row: any) {
  const preparationTime = row.preparationTime !== undefined ? row.preparationTime : row.preparationtime;
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

function parseTable(row: any) {
  const currentOrderId = row.currentOrderId !== undefined ? row.currentOrderId : row.currentorderid;
  const customerName = row.customerName !== undefined ? row.customerName : row.customername;
  const guestsCount = row.guestsCount !== undefined ? row.guestsCount : row.guestscount;
  return {
    id: row.id,
    number: Number(row.number),
    capacity: Number(row.capacity),
    status: row.status,
    currentOrderId: currentOrderId || undefined,
    customerName: customerName || undefined,
    guestsCount: guestsCount != null ? Number(guestsCount) : undefined
  };
}

function parseOrder(row: any) {
  const orderNumber = row.orderNumber !== undefined ? row.orderNumber : row.ordernumber;
  const tableNumber = row.tableNumber !== undefined ? row.tableNumber : row.tablenumber;
  const customerName = row.customerName !== undefined ? row.customerName : row.customername;
  const grandTotal = row.grandTotal !== undefined ? row.grandTotal : row.grandtotal;
  const paymentMethod = row.paymentMethod !== undefined ? row.paymentMethod : row.paymentmethod;
  const createdAt = row.createdAt !== undefined ? row.createdAt : row.createdat;
  const updatedAt = row.updatedAt !== undefined ? row.updatedAt : row.updatedat;
  const specialNotes = row.specialNotes !== undefined ? row.specialNotes : row.specialnotes;
  const waiterId = row.waiterId !== undefined ? row.waiterId : row.waiterid;
  const waiterName = row.waiterName !== undefined ? row.waiterName : row.waitername;
  
  return {
    id: row.id,
    orderNumber,
    tableNumber: Number(tableNumber),
    customerName: customerName || undefined,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    grandTotal: Number(grandTotal),
    status: row.status,
    paymentMethod: paymentMethod || undefined,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    specialNotes: specialNotes || undefined,
    waiterId: waiterId || undefined,
    waiterName: waiterName || undefined
  };
}

function parseReservation(row: any) {
  const customerName = row.customerName !== undefined ? row.customerName : row.customername;
  const tablePreference = row.tablePreference !== undefined ? row.tablePreference : row.tablepreference;
  const createdAt = row.createdAt !== undefined ? row.createdAt : row.createdat;
  return {
    id: row.id,
    customerName,
    phone: row.phone,
    date: row.date,
    time: row.time,
    guests: Number(row.guests),
    tablePreference: tablePreference || undefined,
    status: row.status,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt
  };
}

function parseInventory(row: any) {
  const currentStock = row.currentStock !== undefined ? row.currentStock : row.currentstock;
  const minimumStock = row.minimumStock !== undefined ? row.minimumStock : row.minimumstock;
  const expiryDate = row.expiryDate !== undefined ? row.expiryDate : row.expirydate;
  const unitCost = row.unitCost !== undefined ? row.unitCost : row.unitcost;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    currentStock: Number(currentStock),
    minimumStock: Number(minimumStock),
    unit: row.unit,
    supplier: row.supplier,
    expiryDate: expiryDate || undefined,
    unitCost: unitCost != null ? Number(unitCost) : undefined
  };
}

function parseStaff(row: any) {
  const shiftTiming = row.shiftTiming !== undefined ? row.shiftTiming : row.shifttiming;
  const attendanceStatus = row.attendanceStatus !== undefined ? row.attendanceStatus : row.attendancestatus;
  const performanceRating = row.performanceRating !== undefined ? row.performanceRating : row.performancerating;
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    contact: row.contact || undefined,
    shiftTiming: shiftTiming || undefined,
    attendanceStatus: attendanceStatus,
    performanceRating: performanceRating != null ? Number(performanceRating) : undefined,
    image: row.image
  };
}

function parseFeedback(row: any) {
  const customerName = row.customerName !== undefined ? row.customerName : row.customername;
  const createdAt = row.createdAt !== undefined ? row.createdAt : row.createdat;
  return {
    id: row.id,
    customerName,
    rating: Number(row.rating),
    comment: row.comment,
    status: row.status,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  let log = "";
  
  const addLog = (msg: string) => {
    log += msg + "\n";
    console.log(msg);
  };
  
  try {
    addLog("1. Retrieving pool from db.ts...");
    const activePool = getPool();
    if (!activePool) {
      addLog("activePool is null (connectionString missing).");
      res.status(200).send(log);
      return;
    }
    
    addLog("2. Connecting using getPool()...");
    const client = await activePool.connect();
    addLog("3. Connected successfully.");
    
    try {
      addLog("4. Running queries...");
      const menuRes = await client.query('SELECT * FROM menu_items');
      addLog(`menuRes rows: ${menuRes.rows.length}`);
      menuRes.rows.map(parseMenu);
      
      const tablesRes = await client.query('SELECT * FROM tables ORDER BY number ASC');
      addLog(`tablesRes rows: ${tablesRes.rows.length}`);
      tablesRes.rows.map(parseTable);
      
      const ordersRes = await client.query('SELECT * FROM orders ORDER BY "createdAt" DESC');
      addLog(`ordersRes rows: ${ordersRes.rows.length}`);
      ordersRes.rows.map(parseOrder);
      
      addLog("5. Diagnostics passed on shared pool!");
      res.status(200).send(log);
    } catch (queryErr: any) {
      addLog(`Query error caught: ${queryErr.message}\n${queryErr.stack}`);
      res.status(200).send(log);
    } finally {
      addLog("6. Releasing client...");
      client.release();
      addLog("7. Client released.");
    }
  } catch (error: any) {
    addLog(`Top-level crash caught: ${error.message}\n${error.stack}`);
    res.status(500).send(log);
  }
}
