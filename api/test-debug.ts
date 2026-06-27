import { testDummy } from "../db";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  try {
    const msg = testDummy();
    res.status(200).send(`Success calling testDummy: ${msg}`);
  } catch (error: any) {
    res.status(500).send(`Crash: ${error.message}\n${error.stack}`);
  }
}
