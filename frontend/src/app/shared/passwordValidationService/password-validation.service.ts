import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
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

  private errors: { [key: string]: 'string' };

  constructor(private translate: TranslateService) {
    this.getTransObject();
  }

  public getErrorsText(errs: PasswordErrors): string[] {
    const output: string[] = [];
    let baseStr = this.errors['BASE'];
    if (errs.symbols) {
      output.push(baseStr + this.errors['SYMBOLS']);
    }
    if (errs.lowercase) {
      output.push(baseStr + this.errors['LOWERCASE']);
    }
    if (errs.uppercase) {
      output.push(baseStr + this.errors['UPPERCASE']);
    }
    if (errs.numbers) {
      output.push(baseStr + this.errors['NUMBERS']);
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

  private getTransObject() {
    return this.translate
      .get('PSW_VALIDATION_SERV')
      .pipe(first())
      .subscribe((value) => {
        this.errors = value;
      });
  }
}
