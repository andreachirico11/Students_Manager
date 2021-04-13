import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = false;

  constructor() {}

  autoLogin() {
    return new Observable<boolean>((o) => {
      setTimeout(() => {
        o.next(this._isLoggedIn);
      }, 1000);
    });
  }
}
