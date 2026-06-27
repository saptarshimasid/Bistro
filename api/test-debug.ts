import { INITIAL_MENU_ITEMS } from "../src/data/mockData";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  try {
    res.status(200).send(`Success: ${INITIAL_MENU_ITEMS.length} items`);
  } catch (error: any) {
    res.status(500).send(`Crash: ${error.message}\n${error.stack}`);
  }
}
