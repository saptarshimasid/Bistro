import app from '../server';

export default function handler(req: any, res: any) {
  return new Promise<void>((resolve) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    app(req, res);
  });
}
