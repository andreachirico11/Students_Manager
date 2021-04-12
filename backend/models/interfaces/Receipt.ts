import { Document } from 'mongoose';
import { TypeOfPayment } from './TypeOfPayment';

export interface IReceipt {
  number: string;
  amount: number;
  emissionDate: Date;
  paymentDate: Date;
  typeOfPayment: TypeOfPayment;
}

export interface IFrontendReceipt extends IReceipt {
  id: string;
}

export interface IMongoReceipt extends Document, IReceipt {}
