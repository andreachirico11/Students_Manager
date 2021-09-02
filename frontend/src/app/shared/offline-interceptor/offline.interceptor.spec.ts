import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OfflineInterceptor } from './offline.interceptor';

describe('OfflineInterceptor', () => {
  let service: FakeDataService, controller: HttpTestingController, interceptor: OfflineInterceptor;

  const switchOnOffline = (onOrOff: 'online' | 'offline') => {
    spyOn<any>(interceptor, 'isOnline').and.returnValue(onOrOff === 'online' ? true : false);
  };

  const startOnlineObs = (seconds: number) => {
    spyOn<any>(interceptor, 'windowOnlineObs').and.returnValue(of(true).pipe(delay(seconds)));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        FakeDataService,
        { provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptor, multi: true },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FakeDataService);
    interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(
      (int) => int instanceof OfflineInterceptor
    ) as OfflineInterceptor;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(controller).toBeTruthy();
    expect(interceptor).toBeTruthy();
  });

  it('should get the error without change if connection is established', () => {
    const status = 500,
      statusText = 'connection';
    switchOnOffline('online');
    service
      .postReq()
      .pipe(
        catchError((e: HttpErrorResponse) => {
          expect(e.status).toBe(status);
          expect(e.statusText).toBe(statusText);
          return of();
        })
      )
      .subscribe();
    const req = controller.expectOne(environment.dbUrl);
    req.flush({}, { status, statusText });
  });

  it('should get the error without change if the request method is get', () => {
    const status = 500,
      statusText = 'connection';
    switchOnOffline('offline');
    service
      .getReq()
      .pipe(
        catchError((e: HttpErrorResponse) => {
          expect(e.status).toBe(status);
          expect(e.statusText).toBe(statusText);
          return of();
        })
      )
      .subscribe();
    const req = controller.expectOne(environment.dbUrl);
    req.flush({}, { status, statusText });
  });

  it('should retry the post req after fake window returned online', fakeAsync(() => {
    switchOnOffline('offline');
    service.postReq().subscribe(
      (x) => {},
      (y) => {},
      () => {
        expect('test').toBeTruthy();
      }
    );
    startOnlineObs(500);
    const status = 500,
      statusText = 'connection';
    const req = controller.expectOne(environment.dbUrl);
    req.flush({ body: 'body' }, { status, statusText });
    tick(1000);
  }));
});

@Injectable()
class FakeDataService {
  constructor(private http: HttpClient) {}

  getReq() {
    return this.http.get(environment.dbUrl);
  }

  postReq() {
    return this.http.post(environment.dbUrl, {});
  }
}
