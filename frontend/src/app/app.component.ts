import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
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
  private _isInDarkMode = false;
  private allSubs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private themeService: ThemeService,
    private swUpdate: SwUpdate
  ) {}

  get isLoggedIn() {
    return this.authService.isUserLoggedAndvalid;
  }

  @HostBinding('class.dark-mode')
  get isInDarkMode() {
    return this._isInDarkMode;
  }

  ngOnInit() {
    this.allSubs.push(
      this.themeService.isInDarkMode$.subscribe((trueOrFalse) => (this._isInDarkMode = trueOrFalse))
    );
    this.setTranslateService();
    this.allSubs.push(
      this.authService.logoutHasFired.subscribe(() => {
        this.router.navigate(['enter'], {
          queryParams: {
            redirect: true,
          },
        });
      })
    );
    if (this.swUpdate.isEnabled) {
      this.allSubs.push(this.onSwUpdate(this.swUpdate));
    }
  }

  ngOnDestroy() {
    this.allSubs.forEach((sub) => {
      sub.unsubscribe();
    });
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

  private onSwUpdate(sw: SwUpdate): Subscription {
    return sw.available.subscribe(() => {
      if (confirm('New Version is Available, Load it?')) {
        window.location.reload();
      }
    });
  }
}
