import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DeleteConfirmationDialogService {
  private translations: { [key: string]: string };

  constructor(private dialog: MatDialog, private translator: TranslateService) {
    this.translator
      .get('DIALOG')
      .pipe(first())
      .subscribe((translations) => {
        this.translations = translations;
      });
  }

  open(dialogId?: string): Observable<boolean> {
    const dialogRef = dialogId
      ? this.dialog.open(ConfirmationDialogComponent, {
          id: 'STUDENT_DELETE_DIALOG',
        })
      : this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.dialogTitle = this.translations['DELETE_QUEST'];
    dialogRef.componentInstance.successBtnLabel = this.translations['YES'];
    dialogRef.componentInstance.unsuccessBtnLabel = this.translations['NO'];
    return dialogRef.afterClosed();
  }
}
