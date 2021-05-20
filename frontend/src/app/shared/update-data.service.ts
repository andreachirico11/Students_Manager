import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateDataService<T> {
  private _elementUnderUpdate: T;

  public getElementUnderUpdate(): T {
    const copy = { ...this._elementUnderUpdate };
    this._elementUnderUpdate = null;
    return copy;
  }

  public set elementUnderUpdate(el: T) {
    this._elementUnderUpdate = { ...el };
  }
}
