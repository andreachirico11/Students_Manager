import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DeleteConfirmationDialogService } from 'src/app/shared/delete-confirmation-dialog.service';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';
import { UpdateDataService } from 'src/app/shared/update-data.service';
import { DataService } from '../../data-service/data.service';
import { IReceiptForTable } from './IReceiptForTable';
import { IupdateOrDeleteEvent } from './IUpdateOrDelete';

@Component({
  selector: 'student-receipts',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.scss'],
})
export class ReceiptsTableComponent implements OnInit {
  @Input()
  public receipts: Receipt[] = [];

  @Input()
  public owner: Student;

  public tableDataSource: MatTableDataSource<IReceiptForTable> = null;

  public displayedColumns = [
    'payed',
    'number',
    'amount',
    'emissionDate',
    'paymentDate',
    'typeOfPayment',
    'actions',
  ];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private dataS: DataService,
    private router: Router,
    private updateDataS: UpdateDataService<Receipt>,
    private cdr: ChangeDetectorRef,
    private deleteDialog: DeleteConfirmationDialogService
  ) {}

  ngOnInit() {
    this.initDataSource();
  }

  public addReceipt() {
    this.router.navigate(['compilation', 'receipt', 'add', this.owner.id]);
  }

  public onUpdateOrDelete(ev: IupdateOrDeleteEvent) {
    if (ev.type === 'update') {
      this.updateDataS.elementUnderUpdate = { ...this.receipts.find((r) => r.id === ev.id) };
      this.router.navigate(['compilation', 'receipt', ev.id]);
    }
    if (ev.type === 'delete') {
      this.deleteReceipt(ev.id);
    }
  }

  public deleteReceipt(id: string) {
    this.deleteDialog.open().subscribe((res) => {
      if (res) {
        this.dataS.deleteReceipt(id).subscribe((res) => {
          if (res) {
            this.receipts = this.receipts.filter((r) => r.id !== id);
            this.initDataSource();
          }
        });
      }
    });
    // this.deleteDialog.open().pipe(
    //   switchMap((res) => {
    //     if (res) {
    //       return this.dataS.deleteReceipt(id);
    //     }
    //     return res
    //   })
    // ).subscribe(r => {});
    // REFACTOR
  }

  private initDataSource() {
    if (this.receipts.length > 0) {
      this.tableDataSource = new MatTableDataSource(
        this.receipts.map((r) => {
          return {
            ...r,
            payed: r.paymentDate ? true : false,
          };
        })
      );
      this.cdr.detectChanges();
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    } else {
      this.tableDataSource = null;
    }
  }
}
