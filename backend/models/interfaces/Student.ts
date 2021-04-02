import { Document } from 'mongoose';
import { IParent } from './Parent';

export interface IStudent {
  name: string;
  surname: string;
  schoolClass: string;
  dateOfBirth: Date;
  fiscalCode: string;
  address: string;
  parents: IParent[];
  receiptsId: string[];
  notes?: string;
}

export interface IFrontendStudent extends IStudent {
  id: string;
}

export interface IMongoStudent extends Document, IStudent {}
