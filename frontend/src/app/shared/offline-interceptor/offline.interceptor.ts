import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Observable, timer } from 'rxjs';
import { defaultIfEmpty, first, map, mapTo, retryWhen, switchMap, takeUntil } from 'rxjs/operators';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private message: string;
  private isOnline() {
    return navigator.onLine;
  }
  private windowOnlineObs() {
    return fromEvent(window, 'online').pipe(mapTo(true));
  }

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isOnline() || request.method === 'GET') {
      return next.handle(request);
    }
    if (!this.isOnline()) {
      return this.getTranslatedMessage().pipe(
        switchMap((message) => {
          alert(message);
          return next.handle(request).pipe(retryWhen(() => this.windowOnlineObs()));
        })
      );
    }
  }

  private getTranslatedMessage(): Observable<string> {
    return this.injector
      .get(TranslateService)
      .get('OFFLINE_INTERCEPTOR')
      .pipe(
        takeUntil(timer(500)),
        first(),
        defaultIfEmpty({ MAIN_MESSAGE: 'No Connection' }),
        map((m) => m.MAIN_MESSAGE)
      );
  }
}
