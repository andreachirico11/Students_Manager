import { Request } from 'express';
import { IReceipt } from '../Receipt';

export interface IReceiptRequest extends Request {
  body: IReceipt;
}
