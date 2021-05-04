import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { Receipt } from 'src/app/shared/models/Receipts';
import { DataService } from '../../data-service/data.service';
import { ReceiptsFormComponent } from './receipts-form.component';

describe('ReceiptsFormComponent', () => {
  let component: ReceiptsFormComponent;
  let fixture: ComponentFixture<ReceiptsFormComponent>;
  let routerSpy;
  let _params: { studentId?: string; id?: string } = {};
  let _queryParams: { receiptToUpdate?: string } = {};
  let dataService: DataService;

  const getIfButtonIsDisabled = () => {
    return (
      fixture.debugElement
        .query(By.css('button[type="submit"]'))
        .nativeElement.getAttribute('disabled') === 'true'
    );
  };
  const getFormTitle = () => fixture.debugElement.query(By.css('h2')).nativeElement.textContent;
  const getInputs = () => fixture.debugElement.queryAll(By.css('input'));
  const getMatError = () => fixture.debugElement.queryAll(By.css('mat-error'));
  const fakeSnapshot = {
    get params() {
      return _params;
    },
    get queryParams() {
      return _queryParams;
    },
  };
  const r = new Receipt('xzfadfa', 1, new Date(), new Date(), 'Bancomat');

  beforeEach(async () => {
    routerSpy = jasmine.createSpy('navigate');
    await TestBed.configureTestingModule({
      declarations: [ReceiptsFormComponent],
      imports: [
        MaterialModule,
        CommonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: fakeSnapshot,
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: routerSpy,
          },
        },
      ],
    })
      .overrideComponent(ReceiptsFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptsFormComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    _params = {};
    _queryParams = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('number validation works', () => {
    const { amount } = component.rForm.controls;
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
    const { emissionDate, paymentDate } = component.rForm.controls;
    emissionDate.markAsDirty();
    fixture.detectChanges();
    expect(paymentDate.valid).toBeFalsy();
    emissionDateValue = new Date('2011-03-30');
    paymentDateValue = new Date('2013-03-30');
    emissionDate.setValue(emissionDateValue);
    paymentDate.setValue(paymentDateValue);
    fixture.detectChanges();
    expect(paymentDate.valid).toBeTruthy();
  });

  it('date validation detects smaller payment date', () => {
    const { emissionDate, paymentDate } = component.rForm.controls;
    emissionDate.markAsDirty();
    paymentDate.markAsDirty();
    fixture.detectChanges();
    expect(paymentDate.valid).toBeFalsy('before value');
    emissionDate.setValue(new Date('2011-03-30'));
    paymentDate.setValue(new Date('2011-03-29'));
    fixture.detectChanges();
    expect(paymentDate.valid).toBeFalsy('after value');
  });

  it('date validation should update after payment value changes', () => {
    const { emissionDate, paymentDate } = component.rForm.controls;
    emissionDate.markAsDirty();
    paymentDate.markAsDirty();
    emissionDate.setValue(new Date('2011-03-29'));
    paymentDate.setValue(new Date('2011-03-28'));
    fixture.detectChanges();
    expect(paymentDate.valid).toBeFalsy('before value update');
    paymentDate.setValue(new Date('2011-03-30'));
    fixture.detectChanges();
    expect(paymentDate.valid).toBeTruthy('after value update');
  });

  it('date validation should update after emission value changes', () => {
    const { emissionDate, paymentDate } = component.rForm.controls;
    emissionDate.markAsDirty();
    paymentDate.markAsDirty();
    emissionDate.setValue(new Date('2011-03-30'));
    paymentDate.setValue(new Date('2011-03-29'));
    fixture.detectChanges();
    expect(paymentDate.valid).toBeFalsy('before value update');
    emissionDate.setValue(new Date('2011-03-20'));
    fixture.detectChanges();
    expect(paymentDate.valid).toBeTruthy('after value update');
  });

  xit('shows and hides correctly the error message', () => {
    // expect(getMatError().length).toBe(0, 'before error');
    // const { emissionDate, paymentDate } = componentForm.controls;
    // emissionDate.markAsDirty();
    // paymentDate.markAsDirty();
    // emissionDate.setValue(new Date('2011-03-11'));
    // paymentDate.setValue(new Date('2011-03-10'));
    // componentForm.markAsTouched();
    // componentForm.markAsDirty();
    // fixture.detectChanges();
    // expect(getMatError().length).toBe(1, 'after error');
    // paymentDate.setValue(new Date('2011-03-12'));
    // fixture.detectChanges();
    // expect(getMatError().length).toBe(0, 'after update');
    expect(getMatError().length).toBe(0, 'before error');
    const { emissionDate, paymentDate } = component.rForm.controls;
    paymentDate.statusChanges.subscribe(() => {
      console.log(paymentDate.getError('dateCannotBeGreater'));
      fixture.detectChanges();
      expect(getMatError().length).toBe(1, 'after error');
    });
    paymentDate.setErrors({ dateCannotBeGreater: true });
  });

  xit('does not allow to press the button until all fields are filled', () => {
    const { number, amount, emissionDate, paymentDate, typeOfPayment } = component.rForm.controls;
    // expect(getIfButtonIsDisabled()).toBeTruthy();
    number.setValue(111);
    amount.setValue(222);
    emissionDate.setValue(new Date());
    paymentDate.setValue(new Date());
    typeOfPayment.setValue(1);
    component.rForm.markAsTouched();
    component.rForm.markAsDirty();
    component.rForm.markAllAsTouched();
    getInputs().forEach((input) => {
      input.nativeElement.dispatchEvent(new Event('input'));
    });
    console.log(getInputs());

    component.rForm.updateValueAndValidity();
    fixture.detectChanges();

    expect(getIfButtonIsDisabled()).toBeFalsy();
  });

  it('should start in the correct mode', () => {
    component.ngOnInit();
    expect(routerSpy).toHaveBeenCalledWith(['']);
    _params = {
      studentId: '123',
    };
    component.ngOnInit();
    fixture.detectChanges();
    expect(getFormTitle()).toBe('Add Receipt');
    _params = {
      id: '123',
    };
    _queryParams = {
      receiptToUpdate: JSON.stringify(r),
    };
    component.ngOnInit();
    fixture.detectChanges();
    expect(getFormTitle()).toBe('Update Receipt');
  });

  it('creates a valid receipt', () => {
    _params = {
      studentId: '123',
    };
    component.ngOnInit();
    component.rForm.patchValue({
      number: r.number,
      amount: r.amount,
      emissionDate: r.emissionDate,
      paymentDate: r.paymentDate,
      typeOfPayment: r.typeOfPayment,
    });
    const addSpy = spyOn(dataService, 'addReceipt').and.returnValue(of(r));
    component.onSubmit();
    expect(addSpy).toHaveBeenCalledOnceWith('123', r);
  });

  it('populate the form with correct datas', () => {
    _params = {
      id: '123',
    };
    _queryParams = {
      receiptToUpdate: JSON.stringify(r),
    };
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.rForm.value.typeOfPayment).toBe(r.typeOfPayment, 'internal');
    const numberInput = getInputs()[0];
    expect(numberInput.nativeElement.value).toBe(r.number, 'view');
    const select: MatSelect = fixture.debugElement.query(By.directive(MatSelect)).componentInstance;
    expect(select.value).toBe(r.typeOfPayment, 'select');
  });

  it('launches correctly the update', () => {
    _params = {
      id: '123',
    };
    _queryParams = {
      receiptToUpdate: JSON.stringify(r),
    };
    component.ngOnInit();
    fixture.detectChanges();
    const update = spyOn(dataService, 'updateReceipt').and.returnValue(of(r));
    component.onSubmit();
    expect(update).toHaveBeenCalledOnceWith({ ...r, id: '123' });
  });
});