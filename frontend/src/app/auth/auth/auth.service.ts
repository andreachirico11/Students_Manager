import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
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
  private tokenTimer: any;
  private idleTimer: any;
  private logoutSubject: Subject<any> = new Subject();

  get isUserLoggedAndvalid(): boolean {
    return this.getItemFromLocalStorage() ? this.handleIdleTimeouts() : false;
  }

  get logoutHasFired() {
    return this.logoutSubject.asObservable();
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
          this.startTimers(res.payload);
          this.setItemOnLocalStorage(res.payload, this.getActualDateInMs());
          return true;
        }),
        catchError((err: HttpErrorResponse) => {
          return of(false);
        })
      );
  }

  logout() {
    this.cleanLocalTimers();
    localStorage.removeItem(localStorageDataName);
    this.logoutSubject.next();
  }

  getItemFromLocalStorage() {
    return JSON.parse(localStorage.getItem(localStorageDataName)) as IlocalStorageData;
  }

  private startTimers(res: ILoginBackendResponse) {
    const tokenDelta = res.expirationDate - new Date().getTime();
    this.startLogoutTimer(this.tokenTimer, tokenDelta);
    this.startLogoutTimer(this.idleTimer, environment.idleTimeout);
  }

  private setItemOnLocalStorage(backendRes: ILoginBackendResponse, idleDate: number) {
    const data: IlocalStorageData = {
      userToken: backendRes.token,
      tokenExpDate: backendRes.expirationDate,
      lastActivityTimestamp: idleDate,
    };
    localStorage.setItem(localStorageDataName, JSON.stringify(data));
  }

  private startLogoutTimer(timerRef: any, timeout: number) {
    timerRef = setTimeout(() => {
      this.logout();
    }, timeout);
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

  private cleanLocalTimers() {
    clearTimeout(this.tokenTimer);
    clearTimeout(this.idleTimer);
  }
}
