import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const LOCAL_STR_KEY = 'DARK_MODE';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isInDarkMode: boolean;
  private _isInDarkMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get isInDarkMode$() {
    return this._isInDarkMode$.asObservable();
  }

  private set isInDarkMode(trueOrFalse: boolean) {
    this._isInDarkMode = trueOrFalse;
    this._isInDarkMode$.next(this._isInDarkMode);
  }

  constructor() {
    if (
      this.getFromLocalStorage() ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.switchMode(true);
    } else {
      this.switchMode(false);
    }
  }

  public switchMode(turnOnDarkMode: boolean) {
    if (turnOnDarkMode) {
      this.isInDarkMode = true;
      this.putInLocalStorage();
    } else {
      this.isInDarkMode = false;
      this.removeFromLocalStorage();
    }
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
