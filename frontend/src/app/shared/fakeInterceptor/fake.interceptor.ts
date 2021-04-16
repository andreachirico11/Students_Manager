import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IHttpResponse } from '../models/IHttpResponse';
import { IUserResponse } from '../models/IUserResponse';
import { Student } from '../models/Student';
import { environment } from 'src/environments/environment';
import { StudentMessages, UserMessages } from '../models/MessageEnums';
import { FAKE_DB } from './fakeDb';

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
          return this.getHttpRes(200, this.getAllStudents());
        } else {
          return this.getHttpRes(200, this.getStudent());
        }
      } else if (request.method === 'POST') {
        return this.getHttpRes(201, this.postStudent());
      } else if (request.method === 'PUT') {
        return this.getHttpRes(200, this.putStudent());
      } else if (request.method === 'DELETE') {
        return this.getHttpRes(200, this.deleteStudent());
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

  private getAllStudents(): IHttpResponse<Student[]> {
    return {
      message: StudentMessages.student_found,
      payload: FAKE_DB.students,
    };
  }

  private getStudent(): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_found,
      payload: FAKE_DB.students[0],
    };
  }

  private postStudent(): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_created,
      payload: FAKE_DB.students[0],
    };
  }

  private putStudent(): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_updated,
      payload: FAKE_DB.students[0],
    };
  }

  private deleteStudent(): IHttpResponse<null> {
    return {
      message: StudentMessages.student_deleted,
      payload: null,
    };
  }
}
