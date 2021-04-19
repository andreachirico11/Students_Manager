import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/shared/models/IHttpResponse';
import { IUserRequest } from 'src/app/shared/models/IUserRequest';
import { IUserResponse } from 'src/app/shared/models/IUserResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dbUrl = environment.dbUrl;

  get loggedUser(): IUserResponse | null {
    return (JSON.parse(localStorage.getItem('loggedUser')) as IUserResponse) || null;
  }

  get isUserLogged(): boolean {
    return this.loggedUser ? true : false;
  }

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    const body: IUserRequest = {
      email,
      password,
    };
    return this.http.post<IHttpResponse<IUserResponse>>(this.dbUrl + 'user/login', body).pipe(
      map((res) => {
        localStorage.setItem('loggedUser', JSON.stringify(res.payload));
        return true;
      }),
      catchError((err: HttpErrorResponse) => {
        return of(false);
      })
    );
  }
}
