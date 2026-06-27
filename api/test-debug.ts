import { loadAllData } from "../db";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  let log = "";
  
  const addLog = (msg: string) => {
    log += msg + "\n";
    console.log(msg);
  };
  
  try {
    addLog("1. Calling loadAllData()...");
    const data = await loadAllData();
    addLog("2. loadAllData() completed successfully!");
    
    // Check serialization of each key individually
    const keys = [
      "menuItems",
      "tables",
      "orders",
      "reservations",
      "inventory",
      "staff",
      "activities",
      "settings",
      "feedbacks"
    ];
    
    for (const key of keys) {
      addLog(`Testing serialization of key: ${key}...`);
      try {
        const value = (data as any)[key];
        addLog(`Value type: ${typeof value}, isArray: ${Array.isArray(value)}`);
        if (Array.isArray(value)) {
          addLog(`Length: ${value.length}`);
        }
        const str = JSON.stringify(value);
        addLog(`Successfully serialized ${key}. Size: ${str.length} chars.`);
      } catch (keyErr: any) {
        addLog(`CRASH during serialization of ${key}: ${keyErr.message}\n${keyErr.stack}`);
      }
    }
    
    addLog("3. All diagnostic serialization checks completed!");
    res.status(200).send(log);
  } catch (error: any) {
    addLog(`Top-level crash caught: ${error.message}\n${error.stack}`);
    res.status(500).send(log);
  }
}
