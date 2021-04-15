import { Response } from 'express';
import { HttpResponse } from '../models/httpResponse';

export const generateHttpRes = (res: Response, code: number, title: string, payload?: any) => {
  res.status(code).json(new HttpResponse(title, payload));
};
