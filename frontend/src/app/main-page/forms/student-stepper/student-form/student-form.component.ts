import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Student } from 'src/app/shared/models/Student';
import { AllRegExp } from '../../utils/allRegExp';

@Component({
  selector: 'student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  public studentF: FormGroup;
  get isTouchUiActivate() {
    return window.innerWidth < 500 ? true : false;
  }
  @Output()
  public partialStudent = new EventEmitter<Partial<Student>>();

  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    this.partialStudent.emit(this.studentF.value);
  }

  public patternErrorChecker(controlName: string): boolean {
    const control = this.studentF.get(controlName);
    if (control.errors && control.errors['pattern']) {
      return true;
    }
    return false;
  }

  private initForm() {
    this.studentF = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.pattern(AllRegExp.onlyLettersReg),
      ]),
      surname: new FormControl(null, [
        Validators.required,
        Validators.pattern(AllRegExp.onlyLettersReg),
      ]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      fiscalCode: new FormControl(null, [Validators.required, Validators.pattern(AllRegExp.cfReg)]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(AllRegExp.onlyNumbersReg),
      ]),
      address: new FormControl(null),
      schoolClass: new FormControl(null, [
        Validators.required,
        Validators.pattern(AllRegExp.schoolClassReg),
      ]),
    });
  }
}
