import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Student } from 'src/app/shared/models/Student';
import { FormBaseComponent } from '../../utils/form-base.component';

@Component({
  selector: 'student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent extends FormBaseComponent<Student> {
  constructor(dA: DateAdapter<any>, t: TranslateService) {
    super('StudentForm', dA, t);
  }
}
