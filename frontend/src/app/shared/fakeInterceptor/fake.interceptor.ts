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
import { ILoginBackendResponse } from 'src/app/auth/IloginBackendResponse';
import { environment } from 'src/environments/environment';
import { IHttpResponse } from '../models/IHttpResponse';
import { TokenErrors, UserMessages } from '../models/MessageEnums';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';
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
      return this.login(request.body);
    }
    // if (!request.headers.has('auth')) {
    //   return this.fakeErrorResp();
    // }

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
        return this.getHttpRes(201, this.studentFakeResponses.postStudent(request.body as Student));
      } else if (request.method === 'PUT') {
        return this.getHttpRes(200, this.studentFakeResponses.putStudent(request.body as Student));
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
        return this.getHttpRes(
          201,
          this.receiptFakeResponses.postReceipt(
            this.geUrlLastPart(request.url),
            request.body as Receipt
          )
        );
      } else if (request.method === 'PUT') {
        return this.getHttpRes(200, this.receiptFakeResponses.putReceipt(request.body as Receipt));
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

  private login(body: any) {
    const { email, password } = body;
    if (
      body.email === this.fakeDb.user[0].email &&
      body.password === this.fakeDb.user[0].password
    ) {
      return this.goodLogin();
    } else {
      return this.badLogin();
    }
  }

  private goodLogin() {
    const payload: ILoginBackendResponse = {
      expiresIn: new Date().getTime() + 3600000,
      // expirationDate: new Date().getTime() + 5000,
      token: 'aaaaaaaabbbbbbbbbbbccccccccccdddddddddddddd',
    };
    return this.getHttpRes(200, {
      message: UserMessages.user_found,
      payload,
    });
  }

  private badLogin() {
    return throwError(
      new HttpErrorResponse({ status: 401, error: UserMessages.wrong_credentials })
    );
  }

  private geUrlLastPart(url: string): string {
    const arr = url.split('/');
    return arr[arr.length - 1];
  }

  private fakeErrorResp() {
    return throwError(new HttpErrorResponse({ status: 500, error: TokenErrors.Token_not_found }));
  }
}
