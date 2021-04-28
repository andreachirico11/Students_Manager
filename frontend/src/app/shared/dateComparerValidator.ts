import { AbstractControl } from '@angular/forms';

export function dateComparerValidator(otherFormControl: AbstractControl) {
  return (formControl: AbstractControl): { [message: string]: boolean } => {
    if (otherFormControl.touched) {
      const otherValue = new Date(otherFormControl.value);
      const thisValue = new Date(formControl.value);
      if (thisValue.getTime() < otherValue.getTime()) {
        return { dateCannotBeGreater: true };
      }
    }
    return null;
  };
}
