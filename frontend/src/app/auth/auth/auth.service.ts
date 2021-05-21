import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/shared/models/IHttpResponse';
import { IUserRequest } from 'src/app/shared/models/IUserRequest';
import { environment } from 'src/environments/environment';
import { IlocalStorageData } from '../IlocalStorageData';
import { ILoginBackendResponse } from '../IloginBackendResponse';

const localStorageDataName = 'loggedUser';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dbUrl = environment.dbUrl;

  get isUserLoggedAndvalid(): boolean {
    return this.getItemFromLocalStorage() ? this.handleIdleTimeouts() : false;
  }

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    const body: IUserRequest = {
      email,
      password,
    };
    return this.http
      .post<IHttpResponse<ILoginBackendResponse>>(this.dbUrl + 'user/login', body)
      .pipe(
        map((res) => {
          this.setItemOnLocalStorage(res.payload, this.getActualDateInMs());
          return true;
        }),
        catchError((err: HttpErrorResponse) => {
          return of(false);
        })
      );
  }

  // autoLogin() {
  //   const parsed: IlocalStorageData = JSON.parse(localStorage.getItem(localStorageDataName));
  // }

  logout() {
    localStorage.removeItem(localStorageDataName);
  }

  private setItemOnLocalStorage(backendRes: ILoginBackendResponse, idleDate: number) {
    const data: IlocalStorageData = {
      userToken: backendRes.token,
      tokenExpDate: backendRes.expirationDate,
      lastActivityTimestamp: idleDate,
    };
    localStorage.setItem(localStorageDataName, JSON.stringify(data));
  }

  private getItemFromLocalStorage() {
    return JSON.parse(localStorage.getItem(localStorageDataName)) as IlocalStorageData;
  }

  private handleIdleTimeouts() {
    const localStorageData = this.getItemFromLocalStorage();
    const actualDate = this.getActualDateInMs();
    if (
      this.isIdleDateInvalid(localStorageData.lastActivityTimestamp) ||
      localStorageData.tokenExpDate < actualDate
    ) {
      this.logout();
      return false;
    }
    const updatedData: IlocalStorageData = {
      ...localStorageData,
      lastActivityTimestamp: actualDate,
    };
    localStorage.setItem(localStorageDataName, JSON.stringify(updatedData));
    return true;
  }

  private isIdleDateInvalid(idleDate: number) {
    const actualD = this.getActualDateInMs();
    return actualD - idleDate > environment.idleTimeout;
  }

  private getActualDateInMs() {
    return new Date().getTime();
  }
}
