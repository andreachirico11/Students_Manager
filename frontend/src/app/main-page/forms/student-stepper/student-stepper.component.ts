import { Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Parent } from 'src/app/shared/models/Parent';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'app-student-stepper',
  templateUrl: './student-stepper.component.html',
  styleUrls: ['./student-stepper.component.scss'],
})
export class StudentStepperComponent implements OnInit {
  public studentCreated: Student = null;

  @ViewChild(MatHorizontalStepper)
  private stepper: MatHorizontalStepper;

  constructor() {}

  ngOnInit(): void {}

  onStudentFormEv(student: Partial<Student>) {
    this.studentCreated = new Student(
      student.name,
      student.surname,
      student.schoolClass,
      student.dateOfBirth,
      student.fiscalCode,
      student.phoneNumber,
      null,
      [],
      student.address
    );
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onParentFormEv(parent: Parent) {
    this.studentCreated = { ...this.studentCreated, parent };
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onOk() {
    console.log('ok');
  }
}
