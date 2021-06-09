import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { FAKE_DB } from 'src/app/shared/fakeInterceptor/fakeDb';
import { Parent } from 'src/app/shared/models/Parent';
import { FormBaseComponent } from '../../utils/form-base.component';
import { ParentFormComponent } from './parent-form.component';

describe('ParentFormComponent', () => {
  let component: ParentFormComponent;
  let fixture: ComponentFixture<ParentFormComponent>;

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
  const fakeParent = { ...FAKE_DB.students[0].parent } as Parent;
  const getTestParent = () =>
    new Parent(
      fakeParent.name,
      fakeParent.surname,
      fakeParent.fiscalCode,
      fakeParent.address,
      fakeParent.phoneNumber
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParentFormComponent, FormBaseComponent],
      imports: [
        MaterialModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentFormComponent);
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

  it('displays pattern error messages', () => {
    const { fiscalCode } = getControls();
    fiscalCode.setErrors({ pattern: {} });
    fiscalCode.markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('mat-error')).length).toBe(1);
  });

  it('expect button to be disabled', () => {
    const isBtnDisabled = () => getButton().nativeElement.disabled;
    expect(isBtnDisabled()).toBeTrue();
    component.form.markAllAsTouched();
    expect(isBtnDisabled()).toBeTrue();
  });

  it('expect result to contain parent properties', () => {
    const pr: Parent = {
      name: 'a',
      surname: 'b',
      fiscalCode: 'aaaaaa',
      address: 'asdfjhalfbanflasdbfasf',
      phoneNumber: 1111111111111111111,
    };
    fixture.componentInstance.result.subscribe((p) => {
      expect(p.name).toBe(pr.name);
      expect(p.surname).toBe(pr.surname);
      expect(p.fiscalCode).toBe(pr.fiscalCode);
      expect(p.address).toBe(pr.address);
      expect(p.phoneNumber).toBe(pr.phoneNumber);
    });
    fixture.componentInstance.form.patchValue({
      ...pr,
    });
    fixture.componentInstance.onSubmit();
  });

  it('it load correctly the student on form', () => {
    const testP = getTestParent();
    component.objectToUpdate = testP;
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('input'))[0].nativeElement.value).toBe(testP.name);
  });

  it('expect result to be the updated input', () => {
    const testP = getTestParent(),
      testName = 'bello';
    component.objectToUpdate = testP;
    component.ngOnInit();
    fixture.detectChanges();
    component.form.patchValue({
      ...component.form.value,
      name: testName,
    });
    fixture.componentInstance.result.subscribe((p) => {
      expect(p.name).toEqual(testName);
    });
    fixture.componentInstance.onSubmit();
  });
});
