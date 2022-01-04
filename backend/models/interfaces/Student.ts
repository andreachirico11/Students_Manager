import { Document } from 'mongoose';
import { IReceiptPrice } from './IReceiptPrice';
import { IParent } from './Parent';
import { IFrontendReceipt, IMongoReceipt, parseToFront as recParser } from './Receipt';

interface IStudentBase {
  name: string;
  surname: string;
  dateOfBirth: Date;
  schoolClass: string;
  fiscalCode?: string;
  phoneNumber?: number;
  parent: IParent;
  address?: string;
  notes?: string;
  receiptPrice?: IReceiptPrice;
  isWithRec: boolean;
}

export interface IStudent extends IStudentBase {
  receiptIds: string[] | IMongoReceipt[];
}

export interface IFrontendStudent extends IStudentBase {
  id: string;
  receipts: IFrontendReceipt[];
}

export interface IMongoStudent extends Document, IStudent {}

export function parseToFront(
  input: IMongoStudent | IMongoStudent[]
): IFrontendStudent | IFrontendStudent[] {
  if (Array.isArray(input)) {
    return input.map((mongoS) => parser(mongoS));
  }
  return parser(input);
}

function parser(s: IMongoStudent): IFrontendStudent {
  let receipts: IFrontendReceipt[] = [];
  if (!s.receiptIds.some((obj) => typeof obj === 'string')) {
    receipts = (s.receiptIds as IMongoReceipt[]).map((rec) => recParser(rec) as IFrontendReceipt);
  }
  return {
    id: s._id,
    name: s.name,
    surname: s.surname,
    dateOfBirth: s.dateOfBirth,
    fiscalCode: s.fiscalCode,
    parent: s.parent,
    phoneNumber: s.phoneNumber,
    schoolClass: s.schoolClass,
    address: s.address,
    notes: s.notes,
    receipts,
    isWithRec: s.isWithRec,
    receiptPrice: s.receiptPrice,
  };
}
