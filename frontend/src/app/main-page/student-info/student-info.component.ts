import { Component, Input, OnInit } from '@angular/core';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.scss'],
})
export class StudentInfoComponent implements OnInit {
  @Input()
  public student: Student;

  constructor() {}

  ngOnInit(): void {}
}
