import { Response } from 'express';
import { HttpResponse } from '../models/httpResponse';

export const sendErrorResponse = (res: Response, code: number, errName: string) => {
  res.setHeader('err-name', errName);
  res.status(code).send();
};
