import { Injectable } from '@angular/core';
import { DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const STORE_NAME = 'appConfigs';

export const indexedDbConfig: DBConfig = {
  name: 'PwaDb',
  version: 1,
  objectStoresMeta: [
    {
      store: STORE_NAME,
      storeConfig: { keyPath: 'configName', autoIncrement: false },
      storeSchema: [{ name: 'configValue', keypath: 'configValue', options: { unique: false } }],
    },
  ],
};

const darkModeKey = 'darkMode';
const languageKey = 'language';

type ConfigKeys = typeof darkModeKey | typeof languageKey;

export interface IAppConfig {
  configName: ConfigKeys;
  configValue: any;
}

class AppConfig implements IAppConfig {
  constructor(public configName: ConfigKeys, public configValue: any) {}
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private browserHasIndexedDb: boolean;

  public get isInDarkMode(): Observable<AppConfig> | null {
    return this.getConfig(darkModeKey);
  }

  public get language(): Observable<AppConfig> | null {
    return this.getConfig(languageKey);
  }

  constructor(private indexedDbService: NgxIndexedDBService) {
    this.browserHasIndexedDb = !!window.indexedDB;
  }

  public setDarkMode(trueOrFalse: boolean) {
    this.setConfig(darkModeKey, this.isInDarkMode, trueOrFalse);
  }

  public setLanguage(newLan: string) {
    this.setConfig(languageKey, this.language, newLan);
  }

  private getConfig(configName: ConfigKeys): Observable<AppConfig> | null {
    if (!this.browserHasIndexedDb) {
      return of(null);
    }
    return this.indexedDbService.getByKey<AppConfig>(STORE_NAME, configName);
  }

  private setConfig(configKey: ConfigKeys, configObs: Observable<AppConfig>, newValue: any) {
    if (this.browserHasIndexedDb) {
      const tempSub = configObs
        .pipe(
          switchMap((prevConfig) => {
            const updatedConfig = new AppConfig(configKey, newValue);
            if (prevConfig) {
              return this.indexedDbService.update(STORE_NAME, updatedConfig);
            }
            return this.indexedDbService.addItem(STORE_NAME, updatedConfig);
          })
        )
        .subscribe(() => {
          tempSub.unsubscribe();
        });
    }
  }
}
