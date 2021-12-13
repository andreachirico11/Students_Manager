import { FormGroup } from '@angular/forms';

export function atLeastOneCol(group: FormGroup): { [message: string]: boolean } {
  if (Object.keys(group.controls).every((key) => !group.controls[key].value)) {
    return { atLeastOneValue: true };
  }
  return null;
}
