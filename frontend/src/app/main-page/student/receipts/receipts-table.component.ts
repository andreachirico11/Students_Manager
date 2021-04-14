import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/shared/data-service/data.service';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student-receipts',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.scss'],
})
export class StudentReceiptsComponent implements OnInit {
  @Input()
  public student: Student;

  public receipts: Observable<Receipt[]>;
  public displayedColumns = ['number', 'amount', 'emissionDate', 'paymentDate', 'typeOfPayment'];

  constructor(private dbService: DataService) {}

  ngOnInit(): void {
    // this.receipts = this.dbService.getReceiptsForStudent(this.student.receipts);
  }
}
