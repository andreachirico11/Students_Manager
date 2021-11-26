import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { IHttpPdfParams } from './IHttpPdfParams';

export interface IBackendRequest<T> extends IRequest {
  body: T;
}

export interface IPdfRequest extends Omit<IRequest, 'query'> {
  query: IHttpPdfParams;
}

export interface IRequest extends Request {
  headers: headersWithAuth;
  params: any;
}

interface headersWithAuth extends IncomingHttpHeaders {
  'auth-token': string;
}
