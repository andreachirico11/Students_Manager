import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Receipt } from 'src/app/shared/models/Receipts';

@Component({
  selector: 'student-receipts',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentReceiptsComponent implements OnInit {
  @Input()
  public receipts: Receipt[];

  public displayedColumns = [
    'number',
    'amount',
    'emissionDate',
    'paymentDate',
    'typeOfPayment',
    'actions',
  ];

  ngOnInit(): void {
    // this.receipts = this.dbService.getReceiptsForStudent(this.student.receipts);
  }
}
