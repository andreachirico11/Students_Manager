import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { mapTo, retryWhen, tap } from 'rxjs/operators';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private isOnline() {
    return navigator.onLine;
  }
  private windowOnlineObs() {
    return fromEvent(window, 'online').pipe(mapTo(true));
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isOnline() || request.method === 'GET') {
      return next.handle(request);
    }
    return next.handle(request).pipe(
      tap(() => {
        console.log('tap');
      }),
      retryWhen(() => this.windowOnlineObs())
    );
  }
}
