import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';
import { DataService } from '../../data-service/data.service';
import { IupdateOrDeleteEvent } from './IUpdateOrDelete';

@Component({
  selector: 'student-receipts',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.scss'],
})
export class ReceiptsTableComponent {
  @Input()
  public receipts: Receipt[] = [];

  @Input()
  public owner: Student;

  public dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  public displayedColumns = [
    'number',
    'amount',
    'emissionDate',
    'paymentDate',
    'typeOfPayment',
    'actions',
  ];

  constructor(private dataS: DataService, private dialog: MatDialog, private router: Router) {}

  public addReceipt() {
    this.router.navigate(['compilation', 'receipt', 'add', this.owner.id]);
  }

  public onUpdateOrDelete(ev: IupdateOrDeleteEvent) {
    if (ev.type === 'update') {
      const receiptToUpdate = JSON.stringify({
        ...this.receipts.find((r) => r.id === ev.id),
        ownerId: this.owner.id,
      });
      this.router.navigate(['compilation', 'receipt', ev.id], {
        queryParams: {
          receiptToUpdate,
        },
      });
    }
    if (ev.type === 'delete') {
      this.deleteReceipt(ev.id);
    }
  }

  public deleteReceipt(id: string) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { id: 'RECEIPT_DELETE_DIALOG' });
    this.dialogRef.componentInstance.dialogTitle = 'Do You Really Want To Delete?';
    this.dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dataS.deleteReceipt(id).subscribe((res) => {
          if (res) {
            this.receipts = this.receipts.filter((r) => r.id !== id);
          }
        });
      }
    });
  }

  // private onError() {
  //   const componentInstance = this.dialog.open(ConfirmationDialogComponent);
  //   componentInstance.componentInstance.dialogTitle = `There was a problem ${
  //     this.formMode === 'Add' ? 'adding' : 'updating'
  //   } the receipt`;
  // }
}
