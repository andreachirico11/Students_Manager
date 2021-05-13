import { Component, OnInit } from '@angular/core';
import { FAKE_DB } from 'src/app/shared/fakeInterceptor/fakeDb';

@Component({
  selector: 'app-student-stepper',
  templateUrl: './student-stepper.component.html',
  styleUrls: ['./student-stepper.component.scss'],
})
export class StudentStepperComponent implements OnInit {
  fakeS = FAKE_DB.students[0];

  constructor() {}

  ngOnInit(): void {}
}
