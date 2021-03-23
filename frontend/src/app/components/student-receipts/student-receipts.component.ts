import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Receipt } from 'src/app/models/Receipts';
import { Student } from 'src/app/models/Student';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'student-receipts',
  templateUrl: './student-receipts.component.html',
  styleUrls: ['./student-receipts.component.scss'],
})
export class StudentReceiptsComponent implements OnInit {
  @Input()
  public student: Student;

  public receipts: Observable<Receipt[]>;
  public displayedColumns = ["number", "amount", "emissionDate", "paymentDate", "typeOfPayment"];

  constructor(private dbService: DataService) { }

  ngOnInit(): void {
    this.receipts = this.dbService.getReceiptsForStudent(this.student.receiptsId);
  }
}
