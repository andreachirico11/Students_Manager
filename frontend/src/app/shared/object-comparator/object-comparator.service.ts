import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObjectComparatorService {
  public areObjEquals(obj1: Object, obj2: Object): boolean {
    for (const prop in obj1) {
      if (!obj1 || !obj2) {
        if (obj1 !== obj2) {
          return false;
        }
        continue;
      }
      if (!obj2.hasOwnProperty(prop)) {
        return false;
      }
      const value1 = obj1[prop],
        value2 = obj2[prop];
      if (this.areObjects(value1, value2)) {
        if (this.areDates(value1, value2) && !this.areEqualDates(value1, value2)) {
          return false;
        }
        if (!this.areObjEquals(value1, value2)) {
          return false;
        }
      } else {
        if (value1 !== value2) {
          return false;
        }
        continue;
      }
    }
    return true;
  }

  private areDates(ob1: any, ob2: any): boolean {
    if (this.isDate(ob1) && this.isDate(ob2)) {
      return true;
    }
    return false;
  }

  private areObjects(ob1: any, ob2: any): boolean {
    if (typeof ob1 === 'object' && typeof ob2 === 'object') {
      return true;
    }
    return false;
  }

  private areEqualDates(date1: Date | string, date2: Date | string): boolean {
    if (!this.isDate(date1) || !this.isDate(date2)) {
      return false;
    }
    return new Date(date1).getTime() === new Date(date2).getTime();
  }

  private isDate(o: any): boolean {
    if (typeof o === 'string') {
      o = o.replace(' ', '');
    }
    try {
      const d = new Date(o);
      if (isNaN(d.valueOf())) {
        throw new Error();
      }
    } catch (e) {
      return false;
    }
    return true;
  }
}
