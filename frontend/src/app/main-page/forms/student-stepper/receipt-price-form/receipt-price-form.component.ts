import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { ReceiptPrice } from 'src/app/shared/models/ReceiptPrice';
import { FormBaseComponent } from '../../utils/form-base.component';

@Component({
  selector: 'receipt-price-form',
  templateUrl: './receipt-price-form.component.html',
  styleUrls: ['./receipt-price-form.component.scss'],
})
export class ReceiptPriceFormComponent extends FormBaseComponent<ReceiptPrice> {
  constructor(d: DateAdapter<any>, t: TranslateService) {
    super('ReceiptPriceForm', d, t);
  }

  hasOtherFieldCompiledErr(ctrlName: string): boolean {
    return this.form.get(ctrlName).getError('otherFieldHasBeenCompiled');
  }
}
