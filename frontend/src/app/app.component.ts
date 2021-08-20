import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth/auth/auth.service';
import { GlobalTranslationService } from './shared/global-translation.service';
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
    private globalTransServ: GlobalTranslationService,
    private themeService: ThemeService,
    private swUpdate: SwUpdate,
    private translateSrv: TranslateService
  ) {}

  get isLoggedIn() {
    return this.authService.isUserLoggedAndvalid;
  }

  @HostBinding('class.dark-mode')
  get isInDarkMode() {
    return this._isInDarkMode;
  }

  ngOnInit() {
    this.allSubs.push(this.globalTransServ.setTranslateService().subscribe());
    this.allSubs.push(
      this.themeService.isInDarkMode$.subscribe((trueOrFalse) => (this._isInDarkMode = trueOrFalse))
    );
    this.allSubs.push(this.authService.logoutHasFired.subscribe(() => this.onLogoutFired()));
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
    this.globalTransServ.switchLan(newLan);
  }

  toggleDarkMode(trueOrFalse: boolean) {
    this.themeService.switchMode(trueOrFalse);
  }

  private onLogoutFired() {
    this.router.navigate(['enter'], {
      queryParams: {
        redirect: true,
      },
    });
  }

  private onSwUpdate(sw: SwUpdate): Subscription {
    return sw.available
      .pipe(switchMap(() => this.translateSrv.get('APP_COMPONENT.CONFIRMATION')))
      .subscribe((message: string) => {
        if (confirm(message)) {
          window.location.reload();
        }
      });
  }
}
