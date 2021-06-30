import { NextFunction, Request, Response } from 'express';

const origins = process.env.ALLOWED_ORIGINS ?? '*';

export function corsController(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', origins);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, auth-token'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
}
