import { Injectable } from '@angular/core';
import { PasswordErrors } from './passwordErrors';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidationService {
  private passwordRegexp = {
    symbols: /[$-/:-?{-~!"^_@`\[\]]/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /[0-9]/,
  };

  constructor() {}

  public getErrorsText(errs: PasswordErrors): string[] {
    const output: string[] = [];
    let baseStr = 'Password should contain at least one ';
    if (errs.symbols) {
      output.push(baseStr + 'symbol');
    }
    if (errs.lowercase) {
      output.push(baseStr + 'lowercase letter');
    }
    if (errs.uppercase) {
      output.push(baseStr + 'uppercase letter');
    }
    if (errs.numbers) {
      output.push(baseStr + 'number');
    }
    return output;
  }

  public validatePassword(psw: string): PasswordErrors {
    const errors: PasswordErrors = {};
    for (const key in this.passwordRegexp) {
      if (!this.passwordRegexp[key].test(psw)) {
        errors[key] = true;
      }
    }
    return errors;
  }
}
