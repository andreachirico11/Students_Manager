import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';

import { ReceiptsFormComponent } from './receipts-form.component';

fdescribe('ReceiptsFormComponent', () => {
  let component: ReceiptsFormComponent;
  let fixture: ComponentFixture<ReceiptsFormComponent>;
  let componentForm: FormGroup;

  const getIfButtonIsDisabled = () => {
    const btns = fixture.debugElement.queryAll(By.css('button'));
    return btns[btns.length - 1].nativeElement.getAttribute('disabled') === 'true';
  };
  const getInputs = () => fixture.debugElement.queryAll(By.css('input'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiptsFormComponent],
      imports: [
        MaterialModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    componentForm = component.rForm;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('number validation works', () => {
    const { amount } = componentForm.controls;
    amount.setValue('123');
    expect(amount.invalid).toBeFalsy('test-1');
    amount.setValue(123);
    expect(amount.invalid).toBeFalsy('test-2');
    amount.setValue('123a');
    amount.markAsTouched();
    expect(amount.invalid).toBeTruthy('test-3');
    amount.setValue('a');
    expect(amount.invalid).toBeTruthy('test-4');
    amount.setValue('');
    expect(amount.invalid).toBeTruthy('test-5');
  });

  it('opens the calendar on date input click', () => {
    expect(fixture.debugElement.queryAll(By.css('mat-calendar')).length).toBe(0);
    const firstDateInput = getInputs()[2].nativeElement;
    firstDateInput.click();
    expect(fixture.debugElement.queryAll(By.css('mat-calendar')).length).toBe(1);
  });

  it('date validation detects true case', () => {
    let emissionDateValue, paymentDateValue;
    const { emissionDate, paymentDate } = componentForm.controls;
    emissionDate.markAsTouched();
    fixture.detectChanges();
    expect(paymentDate.valid).toBeFalsy();
    emissionDateValue = new Date('2011-03-30');
    paymentDateValue = new Date('2013-03-30');
    emissionDate.setValue(emissionDateValue);
    paymentDate.setValue(paymentDateValue);
    fixture.detectChanges();

    expect(paymentDate.valid).toBeTruthy();
  });

  it('date validation detects false case', () => {
    let emissionDateValue, paymentDateValue;
    const { emissionDate, paymentDate } = componentForm.controls;
    emissionDate.markAsTouched();
    fixture.detectChanges();
    expect(paymentDate.valid).toBeFalsy();
    emissionDateValue = new Date('2011-03-30');
    paymentDateValue = new Date('2011-03-29');
    emissionDate.setValue(emissionDateValue);
    paymentDate.setValue(paymentDateValue);
    fixture.detectChanges();
    expect(paymentDate.valid).toBeFalsy();
  });

  it('does not allow to press the button until all fields are filled', () => {
    const { number, amount, emissionDate, paymentDate, typeOfPayment } = componentForm.controls;
    expect(getIfButtonIsDisabled()).toBeTruthy();
    number.setValue(111);
    amount.setValue(222);
    emissionDate.setValue(new Date());
    paymentDate.setValue(new Date());
    typeOfPayment.setValue(1);
    fixture.detectChanges();
    expect(getIfButtonIsDisabled()).toBeFalsy();
  });
});
