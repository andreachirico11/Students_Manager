import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OfflineInterceptor } from './offline.interceptor';

let MAT_DIALOG_RESPONSE;

describe('OfflineInterceptor', () => {
  let service: FakeDataService, controller: HttpTestingController, interceptor: OfflineInterceptor;

  const switchOnOffline = (onOrOff: 'online' | 'offline') => {
    spyOn<any>(interceptor, 'isOnline').and.returnValue(onOrOff === 'online' ? true : false);
  };

  const startOnlineObs = (seconds: number) => {
    spyOn<any>(interceptor, 'windowOnlineObs').and.returnValue(of(true).pipe(delay(seconds)));
  };

  beforeEach(() => {
    MAT_DIALOG_RESPONSE = true;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        FakeDataService,
        { provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptor, multi: true },
        { provide: MatDialog, useClass: MockMatDialog },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FakeDataService);
    interceptor = TestBed.inject(HTTP_INTERCEPTORS).find(
      (int) => int instanceof OfflineInterceptor
    ) as OfflineInterceptor;
    spyOn<any>(interceptor, 'browserConfirm').and.returnValue(true);
  });

  afterEach(() => {
    MAT_DIALOG_RESPONSE = false;
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

  it('should return isOffline in the response without errors and stops the http request', () => {
    switchOnOffline('offline');
    service.postReq().subscribe((r) => {
      expect(r['isOffline']).toBeTrue();
    });
    controller.expectNone(environment.dbUrl);
  });

  it('should store post requests and call listen and load method', () => {
    const listenAndLoadSpy = spyOn<any>(interceptor, 'listenAndLoad');
    switchOnOffline('offline');
    service.postReq().subscribe((r) => {
      expect(interceptor['stackOfRequests'].length).toBe(1);
      expect(listenAndLoadSpy).toHaveBeenCalled();
    });
    controller.expectNone(environment.dbUrl);
  });

  it('should store the exact number of requests', () => {
    switchOnOffline('offline');
    forkJoin([1, 2, 3, 4].map(() => service.postReq())).subscribe(() => {
      expect(interceptor['stackOfRequests'].length).toBe(4);
    });
    controller.expectNone(environment.dbUrl);
  });

  it('should resolves a single stacked request when connection returns', fakeAsync(() => {
    switchOnOffline('offline');
    const reloadSpy = spyOn<any>(interceptor, 'reload');
    startOnlineObs(100);
    service.postReq().subscribe(() => {
      tick(100);
      const req = controller.expectOne(environment.dbUrl);
      req.flush({ body: 'body' }, { status: 201, statusText: 'created' });
      expect(reloadSpy).toHaveBeenCalled();
    });
  }));

  it('should resolves a group of stacked request when connection returns', fakeAsync(() => {
    switchOnOffline('offline');
    let postCounter = 0;
    const reloadSpy = spyOn<any>(interceptor, 'reload');
    startOnlineObs(100);
    forkJoin(
      [1, 2, 3, 4].map(() =>
        service.postReq().pipe(
          tap(() => {
            postCounter++;
          })
        )
      )
    )
      .pipe(
        finalize(() => {
          tick(200);
          const req = controller.match(environment.dbUrl);
          req.forEach((r) => r.flush({ body: 'body' }, { status: 201, statusText: 'created' }));
          expect(reloadSpy).toHaveBeenCalled();
          expect(postCounter).toBe(4);
        })
      )
      .subscribe();
  }));

  it('shouldn"t resolve a group of stacked requests if the dialog returns false', fakeAsync(() => {
    switchOnOffline('offline');
    MAT_DIALOG_RESPONSE = false;
    const reloadSpy = spyOn<any>(interceptor, 'reload');
    startOnlineObs(100);
    forkJoin([1, 2, 3, 4].map(() => service.postReq()))
      .pipe(
        finalize(() => {
          tick(200);
          controller.expectNone(environment.dbUrl);
          expect(reloadSpy).not.toHaveBeenCalled();
          expect(interceptor['stackOfRequests'].length).toBe(0);
        })
      )
      .subscribe();
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

class MockMatDialog {
  open() {
    return {
      afterClosed() {
        return of(MAT_DIALOG_RESPONSE);
      },
      componentInstance: {
        dialogTitle: '',
      },
    };
  }
}
