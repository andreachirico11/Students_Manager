import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AllRegExp } from '../../utils/allRegExp';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  public studentF: FormGroup;
  get isTouchUiActivate() {
    return window.innerWidth < 500 ? true : false;
  }

  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    console.log(this.studentF);
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
      address: new FormControl(null, [Validators.required]),
      schoolClass: new FormControl(null, [
        Validators.required,
        Validators.pattern(AllRegExp.schoolClassReg),
      ]),
    });
  }
}
