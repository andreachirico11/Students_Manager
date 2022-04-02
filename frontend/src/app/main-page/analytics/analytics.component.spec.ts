import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { PrintoutService } from '../student/printout/printout-page/printout.service';

import { AnalyticsComponent } from './analytics.component';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let trans: TranslateService;
  let printoutService: PrintoutService;

  const getBtn = () => fixture.debugElement.query(By.css('.submit')).nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsComponent],
      imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    trans = TestBed.inject(TranslateService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    printoutService = TestBed.inject(PrintoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button should be disabled if both dates are not compiled', () => {
    expect(Boolean(getBtn().getAttribute('disabled'))).toBeTrue();
    component.dateEnd = new Date();
    component.dateStart = new Date();
    fixture.detectChanges();
    expect(Boolean(getBtn().getAttribute('disabled'))).toBeFalse();
  });

  it('calls service method with correct params', () => {
    const d1 = new Date(),
      d2 = new Date();
    trans.use('it');
    component.dateEnd = d2;
    component.dateStart = d1;
    component.removeIfWithoutNumer = true;
    fixture.detectChanges();
    const spy = spyOn(printoutService, 'getAllRecs').and.callThrough();
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith({
      locale: 'it',
      dateStart: d1,
      dateEnd: d2,
      removeIfWithoutNumer: true,
    });
  });
});
