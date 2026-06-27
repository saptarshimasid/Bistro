import app from '../server';

export default function handler(req: any, res: any) {
  return new Promise<void>((resolve) => {
    // Resolve when the response is fully written and sent
    res.on('finish', resolve);
    res.on('close', resolve);
    
    // Delegate to Express
    app(req, res);
  });
}
