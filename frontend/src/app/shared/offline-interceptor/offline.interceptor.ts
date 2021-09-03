import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, fromEvent, Observable, of, Subscription } from 'rxjs';
import { defaultIfEmpty, first, map, mapTo, switchMap, switchMapTo } from 'rxjs/operators';
import { IHttpResponse } from '../models/IHttpResponse';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private sub: Subscription;

  private isOnline() {
    return navigator.onLine;
  }
  private windowOnlineObs() {
    return fromEvent(window, 'online').pipe(mapTo(true));
  }
  private listening = false;
  private stackOfRequests: Observable<HttpEvent<any>>[] = [];

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isOnline() || request.method === 'GET' || /login/.test(request.url)) {
      return next.handle(request);
    }
    if (!this.isOnline()) {
      this.stackOfRequests.push(next.handle(request));
      if (!this.listening) {
        this.listenAndLoad();
      }
      return this.getTranslatedMessage().pipe(
        switchMap((message) => {
          return this.getHttpRes(request.method === 'POST' ? 201 : 200, {
            message,
            isOffline: true,
          });
        })
      );
    }
  }

  private getTranslatedMessage(): Observable<string> {
    return this.injector
      .get(TranslateService)
      .get('OFFLINE_INTERCEPTOR')
      .pipe(
        first(),
        defaultIfEmpty({ MAIN_MESSAGE: 'No Connection' }),
        map((m) => m.MAIN_MESSAGE)
      );
  }

  private getHttpRes<T>(
    status: number,
    body: IHttpResponse<T>
  ): Observable<HttpResponse<IHttpResponse<T>>> {
    return of(new HttpResponse({ body, status }));
  }

  private listenAndLoad() {
    this.listening = true;
    this.sub = this.windowOnlineObs()
      .pipe(
        first(),
        switchMap(() => {
          const resp = this.browserConfirm();
          if (resp) {
            return forkJoin(this.stackOfRequests);
          }
          return of(resp);
        })
      )
      .subscribe((resp) => {
        this.listening = false;
        this.destroy();
        if (resp !== false) {
          this.reload();
        }
      });
  }

  private reload() {
    window.location.reload();
  }

  private browserConfirm(): boolean {
    return confirm('reload ?');
  }

  private destroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.stackOfRequests = null;
    this.stackOfRequests = [];
  }
}
