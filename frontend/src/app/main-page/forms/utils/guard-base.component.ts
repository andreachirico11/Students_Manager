import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({ template: '' })
export class ComponentGuarded {
  private _canLeave = true;
  set canLeave(can: boolean) {
    this._canLeave = can;
  }

  constructor(protected dialog: MatDialog) {}

  canDeactivate(): Observable<boolean> {
    if (this._canLeave) {
      return of(true);
    }
    return this.createGuardDialog().afterClosed();
  }

  private createGuardDialog(): MatDialogRef<ConfirmationDialogComponent> {
    const ref = this.dialog.open(ConfirmationDialogComponent);
    ref.componentInstance.dialogTitle = 'Some fields are filled';
    ref.componentInstance.dialogSubTitle = 'Wanna Leave?';
    return ref;
  }
}
