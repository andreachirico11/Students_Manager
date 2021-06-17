import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({ template: '' })
export class ComponentGuarded {
  private _canLeave = true;
  set canLeave(can: boolean) {
    this._canLeave = can;
  }

  protected translations: { [key: string]: string };

  constructor(protected dialog: MatDialog, private translator: TranslateService) {
    this.translator
      .get('DIALOG')
      .pipe(first())
      .subscribe((translations) => {
        this.translations = translations;
      });
  }

  canDeactivate(): Observable<boolean> {
    if (this._canLeave) {
      return of(true);
    }
    return this.createGuardDialog().afterClosed();
  }

  private createGuardDialog(): MatDialogRef<ConfirmationDialogComponent> {
    const ref = this.dialog.open(ConfirmationDialogComponent);
    ref.componentInstance.dialogTitle = this.translations['FILLED_ERR'];
    ref.componentInstance.dialogSubTitle = this.translations['LEAVE'];
    ref.componentInstance.successBtnLabel = this.translations['YES'];
    ref.componentInstance.unsuccessBtnLabel = this.translations['NO'];
    return ref;
  }
}
