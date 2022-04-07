import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimezoneHelperService {
  get currentTimezone() {
    return this.parseToGmt(new Date().getTimezoneOffset());
  }

  parseToGmt(timezoneNumber) {
    const sign = timezoneNumber < 0 ? '+' : '-',
      hours = this.padWithZero(Math.abs(timezoneNumber) / 60, 2),
      mins = this.padWithZero(Math.abs(timezoneNumber) % 60, 2);
    return `${sign}${hours}:${mins}`;
  }

  private padWithZero(number, length) {
    if (number > 24) {
      number = number - 24;
    }
    let stringNum = number + '';
    while (stringNum.length < length) {
      stringNum = 0 + stringNum;
    }
    return stringNum;
  }
}
