import { loadAllData } from "../db";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");
  try {
    const data = await loadAllData();
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (error: any) {
    res.setHeader("Content-Type", "text/plain");
    res.status(500).send(`Crash: ${error.message}\n${error.stack}`);
  }
}
