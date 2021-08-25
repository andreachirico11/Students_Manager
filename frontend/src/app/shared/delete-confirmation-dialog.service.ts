import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DeleteConfirmationDialogService {
  private translations: { [key: string]: string };

  constructor(private dialog: MatDialog, private translator: TranslateService) {}

  open(dialogId?: string): Observable<any> {
    return this.translator.get('DIALOG').pipe(
      switchMap((translations: { [key: string]: string }) => {
        const dialogRef = dialogId
          ? this.dialog.open(ConfirmationDialogComponent, {
              id: 'STUDENT_DELETE_DIALOG',
            })
          : this.dialog.open(ConfirmationDialogComponent);
        dialogRef.componentInstance.dialogTitle = translations['DELETE_QUEST'];
        dialogRef.componentInstance.successBtnLabel = translations['YES'];
        dialogRef.componentInstance.unsuccessBtnLabel = translations['NO'];
        return dialogRef.afterClosed();
      })
    );
  }
}
