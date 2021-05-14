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
  private studentPartial: Partial<Student>;

  @ViewChild(MatHorizontalStepper)
  private stepper: MatHorizontalStepper;

  constructor() {}

  ngOnInit(): void {}

  onStudentFormEv(student: Partial<Student>) {
    this.studentPartial = student;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onParentFormEv(parent: Parent) {
    this.studentPartial.parent = parent;
    this.studentCreated = new Student(
      this.studentPartial.name,
      this.studentPartial.surname,
      this.studentPartial.schoolClass,
      this.studentPartial.dateOfBirth,
      this.studentPartial.fiscalCode,
      this.studentPartial.phoneNumber,
      parent,
      [],
      this.studentPartial.address
    );
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  onOk() {
    console.log('ok');
  }
}
