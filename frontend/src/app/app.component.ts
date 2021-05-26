import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private logoutSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  get isLoggedIn() {
    return this.authService.isUserLoggedAndvalid;
  }

  ngOnInit() {
    this.logoutSub = this.authService.logoutHasFired.subscribe(() => {
      this.router.navigate(['enter']);
    });
  }

  ngOnDestroy() {
    if (this.logoutSub) {
      this.logoutSub.unsubscribe();
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['enter']);
  }
}
