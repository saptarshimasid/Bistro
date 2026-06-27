export default async function handler(req: any, res: any) {
  try {
    const { default: app } = await import('../server');
    return app(req, res);
  } catch (error: any) {
    res.setHeader("Content-Type", "text/plain");
    res.status(500).send(`Crash during load/execution: ${error.message}\n${error.stack}`);
  }
}
