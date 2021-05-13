import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { Parent } from 'src/app/shared/models/Parent';
import { ParentFormComponent } from './parent-form.component';

describe('ParentFormComponent', () => {
  let component: ParentFormComponent;
  let fixture: ComponentFixture<ParentFormComponent>;

  const getControls = () => component.parentF.controls;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParentFormComponent],
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
    component.parentF.markAllAsTouched();
    expect(isBtnDisabled()).toBeTrue();
  });

  it('expect result student to be instance of parent', () => {
    const pr: Parent = new Parent('a', 'b', new Date(), 'c');
    fixture.componentInstance.parent.subscribe((p) => {
      expect(p instanceof Parent).toBeTruthy();
    });
    fixture.componentInstance.parentF.patchValue({
      ...pr,
    });
    fixture.componentInstance.onSubmit();
  });
});
