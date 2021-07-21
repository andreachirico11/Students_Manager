import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
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
  private _isInDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  get isLoggedIn() {
    return this.authService.isUserLoggedAndvalid;
  }

  @HostBinding('class.dark-mode')
  get isInDarkMode() {
    return this._isInDarkMode;
  }

  ngOnInit() {
    this.setTranslateService();
    this.logoutSub = this.authService.logoutHasFired.subscribe(() => {
      this.router.navigate(['enter'], {
        queryParams: {
          redirect: true,
        },
      });
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

  onLanChange(newLan: string) {
    this.translate.use(newLan);
  }

  private setTranslateService() {
    let locale = navigator.languages[0] || 'en';
    if (/-|_/.test(locale)) {
      locale = locale.split(/-|_/)[0];
    }
    this.translate.use(locale);
  }
}
