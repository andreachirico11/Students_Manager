import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CustomPreloadStrategyService implements PreloadingStrategy {
  constructor(private authS: AuthService) {}

  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    if (this.authS.isUserLoggedAndvalid || (route.data && route.data.preload)) {
      if (route.data && route.data.delay) {
        return timer(route.data.delay).pipe(map(() => fn()));
      }
      return fn();
    }
    return of(null);
  }
}
