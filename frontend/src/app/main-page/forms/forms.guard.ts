import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IGuardedForm } from './IGuardedForm';

@Injectable({
  providedIn: 'root',
})
export class FormsGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: IGuardedForm,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> {
    if (nextState && !!nextState.root.queryParams['redirect']) {
      return of(true);
    }
    return component.canDeactivate ? component.canDeactivate() : of(true);
  }
}
