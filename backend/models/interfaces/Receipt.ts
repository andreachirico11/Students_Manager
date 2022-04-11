import { Document } from 'mongoose';
import { TypeOfPayment } from './TypeOfPayment';

export interface IReceipt {
  number: number;
  amount: number;
  emissionDate: Date;
  paymentDate: Date;
  typeOfPayment: TypeOfPayment;
}

export interface IFrontendReceipt extends IReceipt {
  id: string;
}

export interface IMongoReceipt extends Document, IReceipt {}

export function parseToFront(
  r: IMongoReceipt | IMongoReceipt[]
): IFrontendReceipt | IFrontendReceipt[] {
  if (Array.isArray(r)) {
    return r.map((rec) => parse(rec));
  }
  return parse(r);
}

function parse(r: IMongoReceipt): IFrontendReceipt {
  return {
    amount: r.amount,
    emissionDate: r.emissionDate,
    id: r._id,
    number: r.number,
    paymentDate: r.paymentDate,
    typeOfPayment: r.typeOfPayment,
  };
}
