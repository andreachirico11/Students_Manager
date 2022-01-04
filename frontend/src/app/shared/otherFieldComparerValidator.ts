import { FormGroup } from '@angular/forms';

export function checkIfEveryControlIsComipled(...controlnames: string[]) {
  return (form: FormGroup): null => {
    const controlsWithoutValues = controlnames
      .map((name) => form.get(name))
      .filter((ctrl) => !ctrl.value);
    if (controlsWithoutValues.length > 0 && controlsWithoutValues.length < controlnames.length) {
      controlsWithoutValues.forEach((ctrl) => {
        ctrl.setErrors({ otherFieldHasBeenCompiled: true });
      });
    } else {
      controlsWithoutValues.forEach((ctrl) => {
        ctrl.setErrors(null);
      });
    }
    return null;
  };
}
