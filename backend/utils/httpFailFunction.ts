import { Response } from 'express';
import { HttpResponse } from '../models/interfaces/UserResponse';

export const fail = (res: Response, code: number, title: string, err?: any) => {
  res.status(code).json(new HttpResponse(title, err));
};
