import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDatepicker } from '@angular/material/datepicker';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from 'src/app/main-page/forms/forms.module';
import { MaterialModule } from 'src/app/material.module';
import { ReceiptsFilters } from 'src/app/shared/models/receiptsFilters';
import { IStudentPdfParas } from '../IStudentPdfParams';

import { PrintoutPageComponent } from './printout-page.component';

describe('PrintoutPageComponent', () => {
  let component: PrintoutPageComponent;
  let fixture: ComponentFixture<PrintoutPageComponent>;

  const areDateRangesVisibles = () =>
    fixture.debugElement.queryAll(By.directive(MatDatepicker)).length === 2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintoutPageComponent],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
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
    fixture.detectChanges();
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

  // it('should send the correct data', () => {
  //   const data: IStudentPdfParas = {
  //     _studentid: 'abc',
  //     filters: [ReceiptsFilters.dateRange, ReceiptsFilters.isPayed],
  //     orderBy: 'amount'
  //   }
  // })
});
