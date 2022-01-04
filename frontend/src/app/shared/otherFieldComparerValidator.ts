import { AbstractControl, FormGroup } from '@angular/forms';

export function otherFieldCompiledComparer(...otherControls: AbstractControl[]) {
  return (control: AbstractControl): { [message: string]: boolean } => {
    if (
      control.dirty &&
      !control.value &&
      otherControls.length > 0 &&
      atLeastOneControlHasBeenCompiled(otherControls)
    ) {
      control.setErrors({ otherFieldHasBeenCompiled: true });
    }
    return null;
  };
}

function atLeastOneControlHasBeenCompiled(ctrls: AbstractControl[]) {
  return ctrls.some((ctrl) => ctrl.dirty && ctrl.value);
}
