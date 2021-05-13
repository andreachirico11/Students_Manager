import { Component, OnInit } from '@angular/core';
import { FAKE_DB } from 'src/app/shared/fakeInterceptor/fakeDb';
import { Parent } from 'src/app/shared/models/Parent';
import { Student } from 'src/app/shared/models/Student';

@Component({
  selector: 'app-student-stepper',
  templateUrl: './student-stepper.component.html',
  styleUrls: ['./student-stepper.component.scss'],
})
export class StudentStepperComponent implements OnInit {
  fakeS = FAKE_DB.students[0];

  constructor() {}

  ngOnInit(): void {}

  onStudentFormEv(student: Partial<Student>) {
    console.log(student);
  }

  onParentFormEv(parent: Parent) {
    console.log(parent);
  }

  onOk() {
    console.log('ok');
  }
}
