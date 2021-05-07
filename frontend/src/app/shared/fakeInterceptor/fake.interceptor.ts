import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IHttpResponse } from '../models/IHttpResponse';
import { IUserResponse } from '../models/IUserResponse';
import { UserMessages } from '../models/MessageEnums';
import { FAKE_DB } from './fakeDb';
import { ReceiptFakeResponses } from './fakeReceiptRespObj';
import { StudentFakeResponses } from './fakeStudentsRespObj';

@Injectable()
export class FakeInterceptor implements HttpInterceptor {
  private baseUrl = environment.dbUrl;
  private fakeDb = { ...FAKE_DB };
  private studentFakeResponses = new StudentFakeResponses(this.fakeDb.students);
  private receiptFakeResponses = new ReceiptFakeResponses(this.fakeDb.students);

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (/login/.test(request.url)) {
      return this.getHttpRes(200, this.loginRes());
    }
    if (/students/.test(request.url)) {
      if (request.method === 'GET') {
        if (request.url === this.baseUrl + 'students') {
          return this.getHttpRes(200, this.studentFakeResponses.getAllStudents());
        } else {
          return this.getHttpRes(
            200,
            this.studentFakeResponses.getStudent(this.geUrlLastPart(request.url))
          );
        }
      } else if (request.method === 'POST') {
        return this.getHttpRes(201, this.studentFakeResponses.postStudent());
      } else if (request.method === 'PUT') {
        return this.getHttpRes(200, this.studentFakeResponses.putStudent());
      } else if (request.method === 'DELETE') {
        return this.getHttpRes(
          200,
          this.studentFakeResponses.deleteStudent(this.geUrlLastPart(request.url))
        );
      } else {
        console.error('wrong request from interceptor');
      }
    }
    if (/receipts/.test(request.url)) {
      if (request.method === 'POST') {
        return this.getHttpRes(201, this.receiptFakeResponses.postReceipt());
      } else if (request.method === 'PUT') {
        return this.getHttpRes(200, this.receiptFakeResponses.putReceipt());
      } else if (request.method === 'DELETE') {
        return this.getHttpRes(
          200,
          this.receiptFakeResponses.deleteReceipt(this.geUrlLastPart(request.url))
        );
      } else {
        console.error('wrong request from interceptor');
      }
    }
    return next.handle(request);
  }

  private getHttpRes<T>(
    status: number,
    body: IHttpResponse<T>
  ): Observable<HttpResponse<IHttpResponse<T>>> {
    return of(new HttpResponse({ body, status })).pipe(delay(1000));
  }

  private loginRes(): IHttpResponse<IUserResponse> {
    return {
      message: UserMessages.user_found,
      payload: {
        expiresIn: 3600,
        token: 'asdfasfasdfa',
        loggedUserId: '1',
      },
    };
  }

  private geUrlLastPart(url: string): string {
    const arr = url.split('/');
    return arr[arr.length - 1];
  }

  private fakeErrorResp() {
    return throwError(new HttpErrorResponse({ status: 500 }));
  }
}
