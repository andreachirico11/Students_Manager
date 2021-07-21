import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isInDarkMode = true;
    } else {
      this.isInDarkMode = false;
    }
  }
}
