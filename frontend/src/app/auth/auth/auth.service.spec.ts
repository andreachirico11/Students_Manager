import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { IHttpResponse } from 'src/app/shared/models/IHttpResponse';
import { IUserResponse } from 'src/app/shared/models/IUserResponse';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let controller: HttpTestingController;
  const email = 'wella',
    password = '1234',
    respObj: IHttpResponse<IUserResponse> = {
      message: '',
      payload: { expiresIn: 3600, loggedUserId: '1', token: '1234' },
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
      const loggedUser = service.loggedUser;
      expect(loggedUser).toBeTruthy();
      expect(loggedUser.token).toBe(respObj.payload.token);
      expect(service.isUserLogged).toBeTrue();
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

  it('should unauthenticate', () => {
    service.login(email, password).subscribe(() => {
      expect(service.isUserLogged).toBeTrue();
      service.logout();
      expect(service.isUserLogged).toBeFalse();
    });
    const request = controller.expectOne(dbUrl + 'user/login');
    expect(request.request.method).toBe('POST');
    request.flush(respObj);
    controller.verify();
  });
});
