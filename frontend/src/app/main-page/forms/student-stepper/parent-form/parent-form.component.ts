import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Input()
  public parentToUpdate: Parent;

  constructor() {}

  ngOnInit(): void {
    this.initForm();
    if (this.parentToUpdate) {
      this.patchFormWithParent();
    }
  }

  public onSubmit(): void {
    const { name, surname, fiscalCode, phoneNumber, address } = this.parentF.value;
    this.parent.emit(new Parent(name, surname, fiscalCode, address, phoneNumber));
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
      fiscalCode: new FormControl(null, [Validators.required, Validators.pattern(AllRegExp.cfReg)]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(AllRegExp.onlyNumbersReg),
      ]),
      address: new FormControl(null),
    });
  }

  private patchFormWithParent() {
    this.parentF.patchValue({
      name: this.parentToUpdate.name,
      surname: this.parentToUpdate.surname,
      fiscalCode: this.parentToUpdate.fiscalCode,
      phoneNumber: this.parentToUpdate.phoneNumber,
      address: this.parentToUpdate.address || null,
    });
  }
}
