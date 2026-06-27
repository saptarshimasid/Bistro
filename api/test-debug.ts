import { loadAllData } from "../db";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  try {
    const data = await loadAllData();
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (error: any) {
    res.status(500).send(`Crash: ${error.message}\n${error.stack}`);
  }
}
