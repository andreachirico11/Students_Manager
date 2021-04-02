import { Document } from 'mongoose';
import { IParent } from './Parent';
import { IReceipt } from './Receipt';

export interface IStudent {
  name: string;
  surname: string;
  dateOfBirth: Date;
  schoolClass?: string;
  fiscalCode?: string;
  address?: string;
  notes?: string;
  parentIds?: IParent[];
  receiptIds?: IReceipt[];
}

export interface IFrontendStudent extends IStudent {
  id: string;
}

export interface IMongoStudent extends Document, IStudent {}
