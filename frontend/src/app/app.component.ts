import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}

  get isLoggedIn() {
    return this.authService.isUserLoggedAndvalid;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['enter']);
  }
}
