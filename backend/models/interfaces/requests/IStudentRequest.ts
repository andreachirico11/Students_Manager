import { Request } from 'express';
import { IStudent } from '../Student';

export interface IStudentRequest extends Request {
  body: IStudent;
}
