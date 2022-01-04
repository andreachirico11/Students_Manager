import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { FAKE_DB } from 'src/app/shared/fakeInterceptor/fakeDb';
import { Student } from 'src/app/shared/models/Student';

import { StudentFormComponent } from './student-form.component';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;

  const getControls = () => component.form.controls;
  const getButton = () => fixture.debugElement.queryAll(By.css('button[type=submit]'))[0];
  const trueFiscalCodes = [
    'MRSLDA02L51D612X',
    'GGIGTR03T52F839X',
    'LSISFN05H15H501M',
    'MRSLDA02L51D612X',
    'LNTLCU02S25H501N',
    'QRTNLE03M50F205F',
  ];
  const fakeFiscalCodes = [
    'MRSLDAt2L51D612X',
    '1GIGTR03T52F839X',
    'LSISFN05H15501M',
    'MRSLDA02L51D6!2X',
    'LNTLCU02S25H5011',
  ];
  const fakeClasses = ['1bc', '2', 'c', 'asdfasdfs', '11', 'aa'];
  const goodClasses = ['1c', '1C'];
  const fakeStudent = { ...FAKE_DB.students[0] } as Student;
  const getTestStudent = () =>
    new Student(
      fakeStudent.name,
      fakeStudent.surname,
      fakeStudent.parent,
      fakeStudent.receipts,
      true,
      fakeStudent.dateOfBirth,
      fakeStudent.phoneNumber,
      fakeStudent.fiscalCode,
      fakeStudent.schoolClass,
      fakeStudent.address,
      fakeStudent.notes,
      fakeStudent.receiptPrice,
      fakeStudent.id
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentFormComponent],
      imports: [
        MaterialModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expects only letters for name and surname', () => {
    const { name, surname } = getControls(),
      valid = 'abc',
      invalidNum = '1abc',
      invalidSymb = '!abc';
    name.setValue(invalidNum);
    expect(name.invalid).toBeTruthy('1');
    name.setValue(valid);
    expect(name.valid).toBeTruthy('2');
    name.setValue(invalidSymb);
    expect(name.invalid).toBeTruthy('3');
    surname.setValue(invalidNum);
    expect(surname.invalid).toBeTruthy('4');
    surname.setValue(valid);
    expect(surname.valid).toBeTruthy('5');
    surname.setValue(invalidSymb);
    expect(surname.invalid).toBeTruthy('6');
  });

  it('can detect wrong fiscal codes', () => {
    const { fiscalCode } = getControls();
    const fakeTestResults = fakeFiscalCodes.map((code) => {
      fiscalCode.setValue(code);
      return fiscalCode.invalid;
    });
    expect(fakeTestResults.every((f) => f === true)).toBeTruthy('fakes');
    const trueTestResults = trueFiscalCodes.map((code) => {
      fiscalCode.setValue(code);
      return fiscalCode.valid;
    });
    expect(trueTestResults.every((f) => f === true)).toBeTruthy('trues');
  });

  it('accepts a valid school class', () => {
    const { schoolClass } = getControls();
    const fakeTestResults = fakeClasses.map((code) => {
      schoolClass.setValue(code);
      return schoolClass.invalid;
    });
    expect(fakeTestResults.every((f) => f === true)).toBeTruthy('fakes');
    const trueTestResults = goodClasses.map((code) => {
      schoolClass.setValue(code);
      return schoolClass.valid;
    });
    expect(trueTestResults.every((f) => f === true)).toBeTruthy('trues');
  });

  it('displays pattern error messages', () => {
    const { schoolClass } = getControls();
    schoolClass.setErrors({ pattern: {} });
    schoolClass.markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('mat-error')).length).toBe(1);
  });

  it('expect button to be disabled', () => {
    const isBtnDisabled = () => getButton().nativeElement.disabled;
    expect(isBtnDisabled()).toBeTrue();
    component.form.markAllAsTouched();
    expect(isBtnDisabled()).toBeTrue();
  });

  it('expect partial student to be instance of student', () => {
    const st: Partial<Student> = {
      name: 'a',
      surname: 'a',
      dateOfBirth: new Date(),
      fiscalCode: 'a',
      address: 'a',
      schoolClass: 'a',
      phoneNumber: 123,
      isWithRec: true,
    };
    fixture.componentInstance.result.subscribe((p) => {
      expect(p).toEqual(st);
    });
    fixture.componentInstance.form.patchValue({
      ...st,
    });
    fixture.componentInstance.onSubmit();
  });

  it('it load correctly the student on form', () => {
    const testSt = getTestStudent();

    component.objectToUpdate = testSt;
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('input'))[0].nativeElement.value).toBe(testSt.name);
  });

  it('expect partial student to be instance of studentToUpdate if provided', () => {
    const testSt = getTestStudent();
    component.objectToUpdate = testSt;
    component.ngOnInit();
    fixture.detectChanges();
    fixture.componentInstance.result.subscribe((p) => {
      expect(p.name).toEqual(testSt.name);
    });
    fixture.componentInstance.onSubmit();
  });
});
