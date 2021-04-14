import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidationService } from '../shared/passwordValidationService/password-validation.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  public isRegistering = false;
  constructor(
    private router: Router,
    private authS: AuthService,
    public pswService: PasswordValidationService
  ) {}

  onSubmit(f: NgForm) {
    if (this.isRegistering) {
      alert('non abilitato');
    } else {
      this.login(f);
    }
  }

  login(f: NgForm) {
    const { email, password } = f.value;
    this.authS.login(email, password).subscribe((result) => {
      if (result) {
        this.router.navigate(['']);
      } else {
        f.reset();
        for (const control in f.controls) {
          f.controls[control].markAsTouched();
        }
      }
    });
  }
}