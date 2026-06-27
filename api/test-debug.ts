export default function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");
  const env: any = {};
  for (const key in process.env) {
    if (
      key.includes("POSTGRES") || 
      key.includes("DATABASE") || 
      key.includes("VERCEL") || 
      key.includes("NODE")
    ) {
      let val = process.env[key] || "";
      if (val.includes("://")) {
        // Redact password in connection string
        val = val.replace(/:([^:@]+)@/, ":***@");
      }
      env[key] = val;
    }
  }
  res.status(200).send(JSON.stringify({
    message: "Env vars checked successfully",
    env
  }, null, 2));
}
