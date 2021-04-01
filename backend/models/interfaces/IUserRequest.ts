import { Request } from 'express';

export interface IUserRequest extends Request {
  body: IReqBody;
}

interface IReqBody {
  email: string;
  password: string;
  name?: string;
}
