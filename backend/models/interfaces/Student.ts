import { Document } from 'mongoose';
import { IParent } from './Parent';

export interface IStudent {
  name: string;
  surname: string;
  dateOfBirth: Date;
  schoolClass: string;
  fiscalCode: string;
  phoneNumber: number;
  parent: IParent;
  receiptIds: string[];
  address?: string;
  notes?: string;
}

export interface IFrontendStudent extends IStudent {
  id: string;
}

export interface IMongoStudent extends Document, IStudent {}
