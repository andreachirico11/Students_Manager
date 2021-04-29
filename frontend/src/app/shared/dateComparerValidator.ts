import { AbstractControl, FormGroup } from '@angular/forms';

export function formDateComparerValidator(
  controlToCompare: AbstractControl,
  controlUnderValidation: AbstractControl
) {
  return (group: FormGroup): { [message: string]: boolean } => {
    if (controlToCompare.dirty && controlUnderValidation.dirty && controlUnderValidation.value) {
      const dateToCompare = new Date(controlToCompare.value);
      const dateToValidate = new Date(controlUnderValidation.value);
      if (dateToValidate.getTime() < dateToCompare.getTime()) {
        controlUnderValidation.setErrors({ dateCannotBeGreater: true });
      } else {
        controlUnderValidation.setErrors(null);
      }
    }
    return null;
  };
}
