import { Observable } from 'rxjs';

export interface IGuardedForm {
  canDeactivate: () => Observable<boolean>;
}
