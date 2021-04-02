import { Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IFrontendUser extends IUser {
  id: string;
}

export interface IMongoUser extends Document, IUser {}
