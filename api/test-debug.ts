import { getPool } from "../db";

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
    addLog(`activePool type: ${typeof activePool}`);
    if (activePool) {
      addLog(`activePool constructor: ${activePool.constructor.name}`);
      addLog(`activePool has connect: ${typeof activePool.connect}`);
      addLog(`activePool has query: ${typeof activePool.query}`);
    } else {
      addLog("activePool is null/undefined");
    }
    
    res.status(200).send(log);
  } catch (error: any) {
    addLog(`Top-level crash caught: ${error.message}\n${error.stack}`);
    res.status(500).send(log);
  }
}
