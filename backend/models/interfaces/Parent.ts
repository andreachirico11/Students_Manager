import { Document } from 'mongoose';

export interface IParent {
  name: string;
  surname: string;
  dateOfBirth: Date;
  fiscalCode: string;
}

export interface IFrontendParent extends IParent {
  id: string;
}

export interface IMongoParent extends Document, IParent {}
