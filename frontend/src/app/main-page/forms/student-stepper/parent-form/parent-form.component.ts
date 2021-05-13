import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Parent } from 'src/app/shared/models/Parent';
import { AllRegExp } from '../../utils/allRegExp';

@Component({
  selector: 'parent-form',
  templateUrl: './parent-form.component.html',
  styleUrls: ['./parent-form.component.scss'],
})
export class ParentFormComponent implements OnInit {
  public parentF: FormGroup;
  get isTouchUiActivate() {
    return window.innerWidth < 500 ? true : false;
  }
  @Output()
  public parent = new EventEmitter<Parent>();

  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    const { name, surname, dateOfBirth, fiscalCode } = this.parentF.value;
    this.parent.emit(new Parent(name, surname, dateOfBirth, fiscalCode));
  }

  public patternErrorChecker(controlName: string): boolean {
    const control = this.parentF.get(controlName);
    if (control.errors && control.errors['pattern']) {
      return true;
    }
    return false;
  }

  private initForm() {
    this.parentF = new FormGroup({
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
    });
  }
}
