import { AfterViewInit, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PasswordValidationService } from '../shared/passwordValidationService/password-validation.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements AfterViewInit {
  public isRegistering = false;
  public isLoading = false;
  public titleParam = { value: 'Login' };
  public showErrorMessage = false;
  private cutTestMode = false;

  constructor(
    private router: Router,
    private authS: AuthService,
    public pswService: PasswordValidationService
  ) {}

  ngAfterViewInit() {
    if (environment.autoLogin && !this.cutTestMode) {
      this.testAutoLogin();
    }
  }

  onSubmit(f: NgForm) {
    if (this.isRegistering) {
      alert('non abilitato');
    } else {
      this.login(f);
    }
  }

  login(f: NgForm) {
    this.isLoading = true;
    const { email, password } = f.value;
    this.authS.login(email, password).subscribe((result) => {
      if (result) {
        this.router.navigate(['']);
      } else {
        f.reset();
        for (const control in f.controls) {
          f.controls[control].markAsTouched();
        }
        this.showErrorMessage = true;
        this.isLoading = false;
      }
    });
  }

  private testAutoLogin() {
    const conf = this.confirmD();
    if (conf) {
      this.authS.login('admin@email', 'admin').subscribe((result) => {
        if (result) {
          this.router.navigate(['']);
        } else {
          alert('Cannot Auto Login');
        }
      });
    }
  }

  private confirmD(): boolean {
    return confirm('auto login?');
  }
}
