import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndexedDbService } from '../indexed-db.service';

const LOCAL_STR_KEY = 'DARK_MODE';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isInDarkMode: boolean = false;
  private _isInDarkMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get isInDarkMode$() {
    return this._isInDarkMode$.asObservable();
  }

  private set isInDarkMode(trueOrFalse: boolean) {
    this._isInDarkMode = trueOrFalse;
    this._isInDarkMode$.next(this._isInDarkMode);
  }

  constructor(private indexedService: IndexedDbService) {
    this.initialCheck();
  }

  public switchMode(turnOnDarkMode: boolean) {
    if (turnOnDarkMode) {
      this.isInDarkMode = true;
      this.putInLocalStorage();
    } else {
      this.isInDarkMode = false;
      this.removeFromLocalStorage();
    }
    this.indexedService.setDarkMode(this._isInDarkMode);
  }

  private initialCheck() {
    this.indexedService.isInDarkMode.subscribe((darkConfig) => {
      if (darkConfig) {
        this.switchMode(darkConfig.configValue);
      } else if (
        this.getFromLocalStorage() ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.switchMode(true);
      } else {
        this.switchMode(false);
      }
    });
  }

  private getFromLocalStorage() {
    return !!localStorage.getItem(LOCAL_STR_KEY);
  }

  private putInLocalStorage() {
    localStorage.setItem(LOCAL_STR_KEY, this._isInDarkMode.toString());
  }

  private removeFromLocalStorage() {
    localStorage.removeItem(LOCAL_STR_KEY);
  }
}
