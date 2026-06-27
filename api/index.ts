import app from '../server';

export default function handler(req: any, res: any) {
  return new Promise<void>((resolve, reject) => {
    // Intercept response finish
    const originalEnd = res.end;
    res.end = function (...args: any[]) {
      originalEnd.apply(res, args);
      resolve();
    };
    
    // Delegate to Express
    try {
      app(req, res);
    } catch (err) {
      reject(err);
    }
  });
}
