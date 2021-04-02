import { Document } from 'mongoose';
import { PaymentType } from './PaymentType';

export interface IReceipt {
  number: string;
  amount: number;
  emissionDate: Date;
  paymentDate: Date;
  typeOfPayment: PaymentType;
}

export interface IFrontendReceipt extends IReceipt {
  id: string;
}

export interface IMongoReceipt extends Document, IReceipt {}
