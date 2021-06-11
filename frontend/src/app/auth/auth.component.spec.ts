import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { AuthComponent } from './auth.component';
import { AuthModule } from './auth.module';
import { AuthService } from './auth/auth.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  const fakeAuthService: jasmine.SpyObj<AuthService> = jasmine.createSpyObj('AuthService', [
      'login',
    ]),
    emailVal = 'email',
    pswVal = 'password',
    getFormInputs = () =>
      fixture.debugElement
        .queryAll(By.css('input'))
        .map((deb) => deb.nativeNode as HTMLInputElement),
    formFiller = () => {
      const inputs = getFormInputs();
      inputs[0].value = emailVal;
      inputs[1].value = pswVal;
      fixture.detectChanges();
    },
    buttonClicker = () => {
      fixture.debugElement.queryAll(By.css('button'))[0].nativeElement.click();
    },
    setServiceReturnValue = (v: boolean) => {
      fakeAuthService.login.and.returnValue(of(v));
    };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [AppModule, AuthModule, TranslateModule.forRoot()],
      providers: [{ provide: AuthService, useValue: fakeAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fire onSubmit on click', () => {
    const spy = spyOn(component, 'onSubmit');
    buttonClicker();
    expect(spy).toHaveBeenCalled();
  });

  it('should render different forms', () => {
    component.isRegistering = false;
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('mat-form-field')).length).toBe(2);
    component.isRegistering = true;
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('mat-form-field')).length).toBe(3);
  });

  it('should navigate on positive login', () => {
    setServiceReturnValue(true);
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    formFiller();
    buttonClicker();
    expect(routerSpy).toHaveBeenCalled();
  });
});
