import app from '../server';

const handler = (req: any, res: any) => {
  return new Promise<void>((resolve) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    app(req, res);
  });
};

export = handler;
