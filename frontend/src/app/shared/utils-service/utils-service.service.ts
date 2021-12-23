import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  static getIfTouchUiIsActivated() {
    return window.innerWidth < 500 ? true : false;
  }
}
