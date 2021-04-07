import { Request } from 'express';
import { IUser } from '../User';

export interface IUserPostRequest extends Request {
  body: IUser;
}
