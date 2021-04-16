import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IHttpResponse } from '../models/IHttpResponse';
import { IUserResponse } from '../models/IUserResponse';
import { UserMessages } from '../models/MessageEnums';
import { studentFakeResponses } from './fakeStudentsRespObj';

@Injectable()
export class FakeInterceptor implements HttpInterceptor {
  private baseUrl = environment.dbUrl;
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (/login/.test(request.url)) {
      return this.getHttpRes(200, this.loginRes());
    }
    if (/students/.test(request.url)) {
      if (request.method === 'GET') {
        if (request.url === this.baseUrl + 'students') {
          return this.getHttpRes(200, studentFakeResponses.getAllStudents());
        } else {
          return this.getHttpRes(200, studentFakeResponses.getStudent());
        }
      } else if (request.method === 'POST') {
        return this.getHttpRes(201, studentFakeResponses.postStudent());
      } else if (request.method === 'PUT') {
        return this.getHttpRes(200, studentFakeResponses.putStudent());
      } else if (request.method === 'DELETE') {
        return this.getHttpRes(200, studentFakeResponses.deleteStudent());
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
    return of(new HttpResponse({ body, status }));
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
}
