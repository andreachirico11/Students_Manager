import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { IHttpPdfParams } from './IHttpPdfParams';
import { IStudentPdfReqBody } from './IStudentPdfReqBody';

export interface IBackendRequest<T> extends IRequest {
  body: T;
}

export interface IPdfStdRecapReq extends IRequest {
  body: IStudentPdfReqBody;
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
