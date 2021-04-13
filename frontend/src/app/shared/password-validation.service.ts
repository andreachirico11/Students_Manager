import { Injectable } from '@angular/core';

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

  public getErrorsText(errs: { [key: string]: boolean }): string[] {
    const output: string[] = [];
    let containsStr = 'Password should contain at least one ';
    if (errs.symbols) {
      output.push((containsStr += 'symbol'));
    }
    if (errs.lowercase) {
      output.push((containsStr += 'lowercase letter'));
    }
    if (errs.uppercase) {
      output.push((containsStr += 'uppercase letter'));
    }
    if (errs.numbers) {
      output.push((containsStr += 'number'));
    }
    return output.length > 0 ? output : ['Invalid password'];
  }

  public validatePassword(psw: string): { [name: string]: boolean } {
    const errors = {};
    for (const key in this.passwordRegexp) {
      if (!this.passwordRegexp[key].test(psw)) {
        errors[key] = true;
      }
    }
    if (psw.length < 6) {
      errors['length'] = true;
    }
    return errors;
  }
}
