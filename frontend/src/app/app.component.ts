import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private logoutSub: Subscription;

  param = { value: 'world' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  get isLoggedIn() {
    return this.authService.isUserLoggedAndvalid;
  }

  ngOnInit() {
    this.translate.setDefaultLang('en');
    this.translate.use('en');

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
