import { OnDestroy, Output } from '@angular/core';
import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Parent } from 'src/app/shared/models/Parent';
import { Student } from 'src/app/shared/models/Student';
import { AllRegExp } from './allRegExp';

@Component({ template: '' })
export class FormBaseComponent<T extends Student | Parent> implements OnInit, OnDestroy {
  public form: FormGroup;

  @Input()
  public objectToUpdate: T;

  @Output()
  public result = new EventEmitter<any>();

  @Output()
  public formValueChanged = new EventEmitter();

  get isTouchUiActivate() {
    return window.innerWidth < 500 ? true : false;
  }

  private valueSub: Subscription;
  private transSub: Subscription;

  constructor(
    @Inject(String) private typeOfForm: 'StudentForm' | 'ParentForm',
    private dateAd: DateAdapter<any>,
    private tServ: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.objectToUpdate) {
      this.patchFormForUpdate();
    }
    this.valueSub = this.form.valueChanges.subscribe(() => {
      this.formValueChanged.emit();
    });
    this.dateAd.setLocale(this.tServ.currentLang);
    this.transSub = this.tServ.onLangChange.subscribe((ev) => {
      this.dateAd.setLocale(ev.lang);
    });
  }

  ngOnDestroy() {
    this.transSub.unsubscribe();
    this.valueSub.unsubscribe();
  }

  public onSubmit(): void {
    this.result.emit(this.form.value);
  }

  public patternErrorChecker(controlName: string): boolean {
    const control = this.form.get(controlName);
    if (control.errors && control.errors['pattern']) {
      return true;
    }
    return false;
  }

  private initForm() {
    switch (this.typeOfForm) {
      case 'ParentForm':
        this.form = new FormGroup({
          name: new FormControl(null, [
            Validators.required,
            Validators.pattern(AllRegExp.onlyLettersReg),
          ]),
          surname: new FormControl(null, [
            Validators.required,
            Validators.pattern(AllRegExp.onlyLettersReg),
          ]),
          fiscalCode: new FormControl(null, [Validators.pattern(AllRegExp.cfReg)]),
          phoneNumber: new FormControl(null, [Validators.pattern(AllRegExp.onlyNumbersReg)]),
          address: new FormControl(null),
        });
        break;
      case 'StudentForm':
        this.form = new FormGroup({
          name: new FormControl(null, [
            Validators.required,
            Validators.pattern(AllRegExp.onlyLettersReg),
          ]),
          surname: new FormControl(null, [
            Validators.required,
            Validators.pattern(AllRegExp.onlyLettersReg),
          ]),
          dateOfBirth: new FormControl(null),
          fiscalCode: new FormControl(null, [Validators.pattern(AllRegExp.cfReg)]),
          phoneNumber: new FormControl(null, [Validators.pattern(AllRegExp.onlyNumbersReg)]),
          address: new FormControl(null),
          schoolClass: new FormControl(null, [Validators.pattern(AllRegExp.schoolClassReg)]),
        });
        break;
    }
  }

  private patchFormForUpdate() {
    switch (this.typeOfForm) {
      case 'ParentForm':
        if (this.objectToUpdate instanceof Parent) {
          this.form.patchValue({
            name: this.objectToUpdate.name,
            surname: this.objectToUpdate.surname,
            fiscalCode: this.objectToUpdate.fiscalCode,
            phoneNumber: this.objectToUpdate.phoneNumber,
            address: this.objectToUpdate.address ?? null,
          });
        }
        break;
      case 'StudentForm':
        if (this.objectToUpdate instanceof Student) {
          this.form.patchValue({
            name: this.objectToUpdate.name,
            surname: this.objectToUpdate.surname,
            dateOfBirth: this.objectToUpdate.dateOfBirth,
            fiscalCode: this.objectToUpdate.fiscalCode,
            phoneNumber: this.objectToUpdate.phoneNumber,
            address: this.objectToUpdate.address ?? null,
            schoolClass: this.objectToUpdate.schoolClass,
          });
        }
        break;
    }
  }
}
