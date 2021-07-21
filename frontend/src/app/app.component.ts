import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth/auth.service';
import { ThemeService } from './shared/theme-service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private logoutSub: Subscription;
  private _isInDarkMode = false;
  private themeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private themeService: ThemeService
  ) {}

  get isLoggedIn() {
    return this.authService.isUserLoggedAndvalid;
  }

  @HostBinding('class.dark-mode')
  get isInDarkMode() {
    return this._isInDarkMode;
  }

  ngOnInit() {
    this.themeService.isInDarkMode$.subscribe((trueOrFalse) => (this._isInDarkMode = trueOrFalse));
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
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['enter']);
  }

  onLanChange(newLan: string) {
    this.translate.use(newLan);
  }

  toggleDarkMode(trueOrFalse: boolean) {
    this.themeService.switchMode(trueOrFalse);
  }

  private setTranslateService() {
    let locale = navigator.languages[0] || 'en';
    if (/-|_/.test(locale)) {
      locale = locale.split(/-|_/)[0];
    }
    this.translate.use(locale);
  }
}
