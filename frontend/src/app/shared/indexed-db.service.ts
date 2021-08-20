import { Injectable } from '@angular/core';
import { DBConfig, NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const appConfigStore = 'appConfigs';

export const indexedDbConfig: DBConfig = {
  name: 'PwaDb',
  version: 1,
  objectStoresMeta: [
    {
      store: appConfigStore,
      storeConfig: { keyPath: 'configName', autoIncrement: false },
      storeSchema: [{ name: 'configValue', keypath: 'configValue', options: { unique: false } }],
    },
  ],
};

const darkModeKey = 'darkMode';

type ConfigNames = typeof darkModeKey;

interface IAppConfig {
  configName: ConfigNames;
  configValue: any;
}

class AppConfig implements IAppConfig {
  constructor(public configName: ConfigNames, public configValue: any) {}
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private browserHasIndexedDb: boolean;

  public get isInDarkMode(): Observable<AppConfig> | null {
    if (!this.browserHasIndexedDb) {
      return of(null);
    }
    return this.indexedDbService.getByKey<AppConfig>(appConfigStore, darkModeKey);
  }

  constructor(private indexedDbService: NgxIndexedDBService) {
    this.browserHasIndexedDb = !!window.indexedDB;
  }

  public setDarkMode(trueOrFalse: boolean) {
    if (this.browserHasIndexedDb) {
      const tempSub = this.isInDarkMode
        .pipe(
          switchMap((darkModeConfig) => {
            if (darkModeConfig) {
              return this.indexedDbService.update(
                appConfigStore,
                new AppConfig(darkModeKey, trueOrFalse)
              );
            }
            return this.indexedDbService.addItem(
              appConfigStore,
              new AppConfig(darkModeKey, trueOrFalse)
            );
          })
        )
        .subscribe(() => {
          tempSub.unsubscribe();
        });
    }
  }
}
