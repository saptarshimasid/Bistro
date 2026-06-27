import { Pool } from "pg";

function getFallbackDefaults() {
  return { status: "fallback_mock" };
}

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  let log = "";
  
  const addLog = (msg: string) => {
    log += msg + "\n";
    console.log(msg);
  };
  
  try {
    addLog("1. Starting diagnostic database execution...");
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      addLog("No connectionString, returning fallback defaults.");
      res.status(200).send(log + "\nSUCCESS:\n" + JSON.stringify(getFallbackDefaults(), null, 2));
      return;
    }
    
    addLog("2. Creating Pool...");
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000
    });
    
    pool.on('error', (err) => {
      addLog(`Pool error event: ${err.message}`);
    });
    
    addLog("3. Calling pool.connect()...");
    const client = await pool.connect();
    addLog("4. Successfully checked out client from pool.");
    
    client.on('error', (err) => {
      addLog(`Client error event: ${err.message}`);
    });
    
    try {
      addLog("5. Querying menu_items...");
      const menuItems = await client.query('SELECT * FROM menu_items');
      addLog(`Found ${menuItems.rows.length} menu items.`);
      
      addLog("6. Querying tables...");
      const tables = await client.query('SELECT * FROM tables ORDER BY number ASC');
      addLog(`Found ${tables.rows.length} tables.`);
      
      addLog("7. Querying system_settings...");
      const settingsRes = await client.query('SELECT value FROM system_settings WHERE id = $1', ['current']);
      addLog(`System settings queried: ${JSON.stringify(settingsRes.rows[0])}`);
      
      addLog("8. Diagnostic queries completed successfully!");
      res.status(200).send(log);
    } catch (queryErr: any) {
      addLog(`Query error caught: ${queryErr.message}\n${queryErr.stack}`);
      res.status(200).send(log);
    } finally {
      addLog("9. Releasing client...");
      client.release();
      addLog("10. Client released.");
      await pool.end();
      addLog("11. Pool closed.");
    }
  } catch (error: any) {
    addLog(`Top-level crash caught: ${error.message}\n${error.stack}`);
    res.status(500).send(log);
  }
}
