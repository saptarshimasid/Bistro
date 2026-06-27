export default function handler(req: any, res: any) {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("Hello from minimal ESModule handler!");
}
