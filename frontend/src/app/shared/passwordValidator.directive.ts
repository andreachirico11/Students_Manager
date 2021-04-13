import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { PasswordValidationService } from './password-validation.service';

@Directive({
  selector: '[passwordValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }],
})
export class PasswordValidatorDirective implements Validator {
  constructor(private pswService: PasswordValidationService) {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value) {
      const errors = this.pswService.validatePassword(control.value);
      if (errors && Object.keys(errors).length > 0) {
        return errors;
      }
    }
    return null;
  }
}
