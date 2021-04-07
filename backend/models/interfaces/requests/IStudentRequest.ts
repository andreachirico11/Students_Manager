import { Request } from 'express';
import { IStudent } from '../Student';

export interface IStudentPostRequest extends Request {
  body: IStudent;
}
