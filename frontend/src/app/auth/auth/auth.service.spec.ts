import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { MockMatDialog } from 'src/app/main-page/student/receipts/receipts-table.component.spec';
import { IHttpResponse } from 'src/app/shared/models/IHttpResponse';
import { environment } from 'src/environments/environment';
import { IlocalStorageData } from '../IlocalStorageData';
import { ILoginBackendResponse } from '../IloginBackendResponse';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let controller: HttpTestingController;
  const localStorageDataName = 'loggedUser';
  const faketoken = 'abc1234';
  const idleTimeout = environment.idleTimeout;

  const email = 'wella',
    password = '1234',
    respObj: IHttpResponse<ILoginBackendResponse> = {
      message: '',
      payload: { expiresIn: new Date().getTime() + idleTimeout * 10, token: faketoken },
    },
    dbUrl = environment.dbUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        {
          provide: MatDialog,
          useClass: MockMatDialog,
        },
      ],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
    localStorage.removeItem(localStorageDataName);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should returns an observable of boolean', () => {
    service.login(email, password).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const request = controller.expectOne(dbUrl + 'user/login');
    expect(request.request.method).toBe('POST');
    request.flush(respObj);
    controller.verify();
  });

  it('should store a user in the local storage', () => {
    service.login(email, password).subscribe(() => {
      const saved: IlocalStorageData = JSON.parse(localStorage.getItem(localStorageDataName));
      expect(saved.userToken).toBe(faketoken);
    });
    const request = controller.expectOne(dbUrl + 'user/login');
    expect(request.request.method).toBe('POST');
    request.flush(respObj);
    controller.verify();
  });

  it('should handle error and return false', () => {
    service.login(email, password).subscribe((r) => {
      expect(r).toBeFalse();
    });
    const request = controller.expectOne(dbUrl + 'user/login');
    expect(request.request.method).toBe('POST');
    request.flush('no_user_found', { status: 404, statusText: 'error' });
    controller.verify();
  });

  it('should return false if the token has expired', fakeAsync(() => {
    spyOn<any>(service, 'isIdleDateInvalid').and.returnValue(false);
    const fakePassedTime = 60000;
    service.login(email, password).subscribe((res) => {
      expect(service.isUserLoggedAndvalid).toBeTruthy();
      tick(fakePassedTime + 1);
      expect(service.isUserLoggedAndvalid).toBeFalsy();
    });
    const request = controller.expectOne(dbUrl + 'user/login');
    expect(request.request.method).toBe('POST');
    request.flush({
      ...respObj,
      payload: {
        ...respObj.payload,
        expiresIn: fakePassedTime,
      },
    });
    controller.verify();
    flush();
  }));

  it('should return false after a specified idle time', fakeAsync(() => {
    service.login(email, password).subscribe();
    const request = controller.expectOne(dbUrl + 'user/login');
    request.flush(respObj);
    expect(service.isUserLoggedAndvalid).toBeTruthy();
    tick(idleTimeout + 1000);
    expect(service.isUserLoggedAndvalid).toBeFalsy();
    flush();
  }));

  it('should unauthenticate', fakeAsync(() => {
    service.login(email, password).subscribe();
    const request = controller.expectOne(dbUrl + 'user/login');
    request.flush(respObj);
    expect(service.isUserLoggedAndvalid).toBeTrue();
    service.logout();
    expect(service.isUserLoggedAndvalid).toBeFalse();
    flush();
  }));

  it('should automatically logout after token has expired', fakeAsync(() => {
    const tokenExp = 10000,
      logoutSpy = spyOn(service, 'logout');
    service.login(email, password).subscribe();
    const request = controller.expectOne(dbUrl + 'user/login');
    const respO: IHttpResponse<ILoginBackendResponse> = {
      ...respObj,
      payload: { ...respObj.payload },
    };
    respO.payload.expiresIn = tokenExp;
    request.flush(respO);
    expect(logoutSpy).not.toHaveBeenCalled();
    tick(tokenExp);
    expect(logoutSpy).toHaveBeenCalled();
    flush();
  }));

  it('should automatically logout after idle timer has expired', fakeAsync(() => {
    let hasBeenCalled = false;
    service.logoutHasFired.subscribe(() => {
      hasBeenCalled = true;
    });
    service.login(email, password).subscribe();
    const request = controller.expectOne(dbUrl + 'user/login');
    request.flush(respObj);
    tick(idleTimeout + 1);
    expect(hasBeenCalled).toBeTrue();
    flush();
  }));
});
