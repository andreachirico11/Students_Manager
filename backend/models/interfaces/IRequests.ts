import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export interface IBackendRequest<T> extends IRequest {
  body: T;
}

export interface IRequest extends Request {
  headers: headersWithAuth;
}

interface headersWithAuth extends IncomingHttpHeaders {
  'auth-token': string;
}
