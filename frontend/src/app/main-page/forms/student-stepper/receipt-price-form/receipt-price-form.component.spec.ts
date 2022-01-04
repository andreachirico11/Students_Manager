import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { FormBaseComponent } from '../../utils/form-base.component';
import { ReceiptPriceFormComponent } from './receipt-price-form.component';

describe('ReceiptPriceFormComponent', () => {
  let component: ReceiptPriceFormComponent;
  let fixture: ComponentFixture<ReceiptPriceFormComponent>;

  const getControls = () => component.form.controls;
  const getButton = () => fixture.debugElement.queryAll(By.css('button[type=submit]'))[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiptPriceFormComponent, FormBaseComponent],
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
    fixture = TestBed.createComponent(ReceiptPriceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expects only numbers', () => {
    const { price, tax, total } = getControls();
    price.setValue('abc');
    expect(price.invalid).toBeTrue();
    price.setValue(1.423);
    expect(price.valid).toBeTrue();
    tax.setValue('abc');
    expect(tax.invalid).toBeTrue();
    tax.setValue(1.423);
    expect(tax.valid).toBeTrue();
    total.setValue('abc');
    expect(total.invalid).toBeTrue();
    total.setValue(1.423);
    expect(total.valid).toBeTrue();
  });

  it('expects price field to be invalid if at least one of the other formField has been touched and has a value', () => {
    const { price, tax, total } = getControls();
    component.ngOnInit();
    expect(price.invalid).toBeFalse();
    tax.setValue(1);
    tax.markAsTouched();
    tax.updateValueAndValidity();
    price.markAsTouched();
    price.updateValueAndValidity();
    expect(price.invalid).toBeTrue();
    price.setValue(1);
    price.updateValueAndValidity();
    expect(price.invalid).toBeFalse();
    price.setValue(null);
    price.updateValueAndValidity();
    expect(price.valid).toBeFalse();
    tax.setValue(null);
    tax.updateValueAndValidity();
    price.updateValueAndValidity();
    expect(price.invalid).toBeFalse();
  });
});
