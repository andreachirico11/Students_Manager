import { AbstractControl } from '@angular/forms';

export function otherFieldCompiledComparer(...otherControls: AbstractControl[]) {
  return (control: AbstractControl): { [message: string]: boolean } => {
    if (
      control.touched &&
      !control.value &&
      otherControls.length > 0 &&
      atLeastOneControlHasBeenCompiled(otherControls)
    ) {
      return { otherFieldHasBeenCompiled: true };
    }
    return null;
  };
}

function atLeastOneControlHasBeenCompiled(ctrls: AbstractControl[]) {
  return ctrls.some((ctrl) => ctrl.touched && ctrl.value);
}
