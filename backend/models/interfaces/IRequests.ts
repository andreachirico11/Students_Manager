import { Request } from 'express';

export interface IBackendRequest<T> extends Request {
  body: T;
}
