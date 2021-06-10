import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { PasswordErrors } from './passwordErrors';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidationService implements OnDestroy {
  private passwordRegexp = {
    symbols: /[$-/:-?{-~!"^_@`\[\]]/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /[0-9]/,
  };

  constructor(private translate: TranslateService) {
    console.log('const');
  }

  ngOnDestroy() {
    console.log('destroy');
  }

  public getErrorsText(errs: PasswordErrors): Observable<string[]> {
    return this.translate.get('PSW_VALIDATION_SERV').pipe(
      first(),
      map((errors: Object) => {
        const output: string[] = [];
        let baseStr = errors['BASE'];
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
      })
    );
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
