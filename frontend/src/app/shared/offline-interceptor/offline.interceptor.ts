import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { timer } from 'rxjs';
import { fromEvent, Observable } from 'rxjs';
import { defaultIfEmpty, first, mapTo, retryWhen, takeUntil, timeout } from 'rxjs/operators';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private message: string;
  private isOnline() {
    return navigator.onLine;
  }
  private windowOnlineObs() {
    return fromEvent(window, 'online').pipe(mapTo(true));
  }

  constructor(translateService: TranslateService) {
    translateService
      .get('OFFLINE_INTERCEPTOR')
      .pipe(takeUntil(timer(500)), first(), defaultIfEmpty({ MAIN_MESSAGE: 'No Connection' }))
      .subscribe((val) => (this.message = val.MAIN_MESSAGE));
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isOnline() || request.method === 'GET') {
      return next.handle(request);
    }
    if (!this.isOnline()) {
      alert(this.message);
      return next.handle(request).pipe(retryWhen(() => this.windowOnlineObs()));
    }
  }
}
