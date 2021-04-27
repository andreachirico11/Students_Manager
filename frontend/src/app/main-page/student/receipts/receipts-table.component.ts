import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Receipt } from 'src/app/shared/models/Receipts';
import { DataService } from '../../data-service/data.service';
import { IupdateOrDeleteEvent } from './receipts-actions/receipts-actions.component';

@Component({
  selector: 'student-receipts',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.scss'],
})
export class ReceiptsTableComponent {
  @Input()
  public receipts: Receipt[] = [];

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
    // this.router
  }

  public onUpdateOrDelete(ev: IupdateOrDeleteEvent) {
    if (ev.type === 'update') {
      // this.router
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
}
