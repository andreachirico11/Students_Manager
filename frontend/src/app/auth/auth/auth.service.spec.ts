import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { IHttpResponse } from 'src/app/shared/models/IHttpResponse';
import { environment } from 'src/environments/environment';
import { IlocalStorageData } from '../IlocalStorageData';
import { ILoginBackendResponse } from '../IloginBackendResponse';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let controller: HttpTestingController;
  const localStorageDataName = 'loggedUser';
  const getActualDateInMs = () => new Date().getTime();
  const faketoken = 'abc1234';
  const idleTimeout = environment.idleTimeout;

  const email = 'wella',
    password = '1234',
    respObj: IHttpResponse<ILoginBackendResponse> = {
      message: '',
      payload: { expirationDate: new Date().getTime() + idleTimeout * 10, token: faketoken },
    },
    dbUrl = environment.dbUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [{ provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
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

  it('should return false after a specified idle time', fakeAsync(() => {
    service.login(email, password).subscribe((res) => {
      expect(service.isUserLoggedAndvalid).toBeTruthy();
      tick(idleTimeout + 1);
      expect(service.isUserLoggedAndvalid).toBeFalsy();
    });
    const request = controller.expectOne(dbUrl + 'user/login');
    expect(request.request.method).toBe('POST');
    request.flush(respObj);
    controller.verify();
  }));

  it('should return false if the token has expired time', fakeAsync(() => {
    spyOn<any>(service, 'isIdleDateInvalid').and.returnValue(false);
    const fakePassedTime = 60000,
      expTestDate = new Date().getTime() + fakePassedTime;
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
        expirationDate: expTestDate,
      },
    });
    controller.verify();
  }));

  it('should unauthenticate', () => {
    service.login(email, password).subscribe(() => {
      expect(service.isUserLoggedAndvalid).toBeTrue();
      service.logout();
      expect(service.isUserLoggedAndvalid).toBeFalse();
    });
    const request = controller.expectOne(dbUrl + 'user/login');
    expect(request.request.method).toBe('POST');
    request.flush(respObj);
    controller.verify();
  });
});
