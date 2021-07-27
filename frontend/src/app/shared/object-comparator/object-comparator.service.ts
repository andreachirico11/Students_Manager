import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObjectComparatorService {
  public areObjEquals(obj1: Object, obj2: Object): boolean {
    for (const prop in obj1) {
      if (!obj2.hasOwnProperty(prop)) {
        return false;
      }
      if (obj1[prop] && typeof obj1[prop] === 'object') {
        if (!this.areObjEquals(obj1[prop], obj2[prop])) {
          return false;
        }
      } else {
        if (obj1[prop] !== obj2[prop]) {
          return false;
        }
      }
    }
    return true;
  }
}
