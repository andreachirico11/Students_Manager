import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { IUser } from '../../shared/models/User';
import { environment } from 'src/environments/environment.prod';

describe('AuthService', () => {
  let service: AuthService;
  let controller: HttpTestingController;
  const email = 'wella',
    password = '1234',
    respObj: IUser[] = [{ email: 'wella', id: '', password: '1234', name: 'gianni' }],
    dbUrl = environment.dbUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should returns an observable of boolean', () => {
    service.login(email, password).subscribe((res) => {
      expect(typeof res === 'boolean').toBeTruthy();
      expect(res).toBeTrue();
    });
    const request = controller.expectOne(dbUrl + 'users');
    expect(request.request.method).toBe('GET');
    request.flush(respObj);
    controller.verify();
  });

  it('should store a user in the local storage', () => {
    service.login(email, password).subscribe((res) => {
      const loggedUser = service.loggedUser;
      expect(loggedUser).toBeTruthy();
      expect(loggedUser.name).toBe(respObj[0].name);
      expect(service.isUserLogged).toBeTrue();
    });
    const request = controller.expectOne(dbUrl + 'users');
    expect(request.request.method).toBe('GET');
    request.flush(respObj);
    controller.verify();
  });
});
