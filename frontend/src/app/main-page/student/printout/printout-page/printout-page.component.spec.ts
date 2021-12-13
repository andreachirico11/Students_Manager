import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { ReceiptsFilters } from 'src/app/shared/models/receiptsFilters';
import { IStudentPdfReqBody } from '../IStudentPdfReqBody';
import { PrintoutPageComponent } from './printout-page.component';
import { PrintoutService } from './printout.service';

describe('PrintoutPageComponent', () => {
  let component: PrintoutPageComponent;
  let fixture: ComponentFixture<PrintoutPageComponent>;
  let printoutService: PrintoutService;
  let trans: TranslateService;

  const areDateRangesVisibles = () =>
    fixture.debugElement.queryAll(By.directive(MatDatepicker)).length === 2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintoutPageComponent],
      imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { parent: { params: { id: 'abc' } } },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintoutPageComponent);
    component = fixture.componentInstance;
    printoutService = TestBed.inject(PrintoutService);
    trans = TestBed.inject(TranslateService);
    fixture.detectChanges();
    trans.use('it');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should show dateFields when daterange is selected',
    waitForAsync(() => {
      expect(areDateRangesVisibles()).toBeFalse();
      component.form.get('filters').setValue([ReceiptsFilters.dateRange]);
      component.form.updateValueAndValidity();
      fixture.detectChanges();
      expect(areDateRangesVisibles()).toBeTrue();
    })
  );

  it(
    'should hide dateFields when daterange is deselected',
    waitForAsync(() => {
      component.form.get('filters').setValue([ReceiptsFilters.dateRange]);
      component.form.updateValueAndValidity();
      fixture.detectChanges();
      expect(areDateRangesVisibles()).toBeTrue();
      component.form.get('filters').setValue([]);
      component.form.updateValueAndValidity();
      fixture.detectChanges();
      expect(areDateRangesVisibles()).toBeFalse();
    })
  );

  it(
    'should hide dateFields when thisYear is selected',
    waitForAsync(() => {
      component.form.get('filters').setValue([ReceiptsFilters.dateRange]);
      component.form.updateValueAndValidity();
      fixture.detectChanges();
      expect(areDateRangesVisibles()).toBeTrue();
      component.form.get('filters').setValue([ReceiptsFilters.thisYear]);
      component.form.updateValueAndValidity();
      fixture.detectChanges();
      expect(areDateRangesVisibles()).toBeFalse();
    })
  );

  it(
    'should remove thisYear when thisMonth is selected',
    waitForAsync(() => {
      component.form.get('filters').setValue([ReceiptsFilters.thisYear]);
      component.form.updateValueAndValidity();
      component.form.get('filters').setValue([ReceiptsFilters.thisMonth]);
      component.form.updateValueAndValidity();
      expect(component.form.get('filters').value).toEqual([ReceiptsFilters.thisMonth]);
    })
  );

  it('should send the correct data', () => {
    const data: IStudentPdfReqBody = {
      columns: ['number', 'typeOfPayment'],
      _studentId: 'abc',
      locale: 'it',
      filters: ['thisMonth', 'isPayed'],
      orderBy: 'number',
      ascending: true,
    };
    component.form.patchValue({
      columns: {
        number: true,
        amount: false,
        emissionDate: false,
        paymentDate: false,
        typeOfPayment: true,
      },
      filters: ['thisMonth', 'isPayed'],
      orderBy: 'number',
    });
    fixture.detectChanges();
    const spy = spyOn(printoutService, 'getStudentRecsPdf').and.callThrough();
    component.onGenerate();
    expect(spy).toHaveBeenCalledWith(data);
  });

  it('should send the correct data with dates', () => {
    const startDate = new Date(),
      endDate = new Date();
    const data: IStudentPdfReqBody = {
      columns: ['number', 'typeOfPayment'],
      _studentId: 'abc',
      locale: 'it',
      filters: ['dateRange', 'isPayed'],
      orderBy: 'number',
      dateRange: {
        startDate,
        endDate,
      },
      ascending: true,
    };
    component.form.patchValue({
      columns: {
        number: true,
        amount: false,
        emissionDate: false,
        paymentDate: false,
        typeOfPayment: true,
      },
      filters: ['dateRange', 'isPayed'],
      orderBy: 'number',
    });
    fixture.detectChanges();
    component.form.get('dateRange').patchValue({
      startDate,
      endDate,
    });
    const spy = spyOn(printoutService, 'getStudentRecsPdf').and.callThrough();
    component.onGenerate();
    expect(spy).toHaveBeenCalledWith(data);
  });
});
