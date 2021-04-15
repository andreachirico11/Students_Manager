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

@Injectable()
export class FakeInterceptor implements HttpInterceptor {
  private baseUrl = environment.dbUrl;
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (/login/.test(request.url)) {
      return of(new HttpResponse({ body: this.loginRes(), status: 200 }));
    }
    if (request.url === this.baseUrl + '/students' && request.method === 'GET') {
      console.log('getall');

      return next.handle(request);
    }
    return next.handle(request);
  }

  private loginRes(): IHttpResponse<IUserResponse> {
    return {
      message: 'user_found',
      payload: {
        expiresIn: 3600,
        token: 'asdfasfasdfa',
        loggedUserId: '1',
      },
    };
  }

  private getAllStudents(): IHttpResponse<Student> {
    return;
  }
}
