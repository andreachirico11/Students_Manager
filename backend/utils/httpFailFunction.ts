import { Response } from 'express';
import { HttpResponse } from '../models/interfaces/UserResponse';

export const generateHttpRes = (res: Response, code: number, title: string, payload?: any) => {
  res.status(code).json(new HttpResponse(title, payload));
};
