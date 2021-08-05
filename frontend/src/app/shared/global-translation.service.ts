import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { IndexedDbService } from './indexed-db.service';

enum ActualTranslations {
  en = 'en',
  it = 'it',
}

@Injectable({
  providedIn: 'root',
})
export class GlobalTranslationService {
  constructor(private translate: TranslateService, private idexDbSrv: IndexedDbService) {}

  public setTranslateService() {
    return this.idexDbSrv.language.pipe(
      tap((indexedLan) => {
        if (indexedLan) {
          return this.translate.use(indexedLan.configValue);
        }
        let locale = this.getBrowserLocale();
        if (!locale || !this.isLanPresent(locale)) {
          locale = 'en';
        }
        this.translate.use(locale);
      })
    );
  }

  public switchLan(newLan: string) {
    if (this.isLanPresent(newLan)) {
      this.translate.use(newLan);
      this.idexDbSrv.setLanguage(newLan);
    }
  }

  private getBrowserLocale() {
    if (!navigator.languages || navigator.languages.length === 0) {
      return null;
    }
    let locale = navigator.languages[0];
    if (/-|_/.test(locale)) {
      locale = locale.split(/-|_/)[0];
    }
    return locale;
  }

  private isLanPresent(locale: string) {
    return Object.keys(ActualTranslations).some((l) => l === locale);
  }
}
