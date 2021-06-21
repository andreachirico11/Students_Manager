import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { PaymentType } from '../models/PaymentType';

@Pipe({
  name: 'paymentType',
})
export class PaymentTypePipe implements PipeTransform {
  private payments: { [key: string]: string };

  constructor(translate: TranslateService) {
    translate
      .get('PAYMENT_TYPES')
      .pipe(first())
      .subscribe((value) => {
        this.payments = value;
      });
  }

  transform(value: PaymentType): string {
    return this.getVal(value);
  }

  private getVal(valName: PaymentType): string {
    switch (valName) {
      case 'atm':
        return this.payments['ATM'];
      case 'money':
        return this.payments['MONEY'];
      case 'transfer':
      default:
        return this.payments['TRANSFER'];
    }
  }
}
