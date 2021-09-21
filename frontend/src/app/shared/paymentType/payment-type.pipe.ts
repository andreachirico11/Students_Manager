import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaymentType } from '../models/PaymentType';

@Pipe({
  name: 'paymentType',
  pure: false,
})
export class PaymentTypePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(value: PaymentType): string {
    const payments = this.translate.instant('PAYMENT_TYPES');
    if (!value) return '';
    switch (value) {
      case 'atm':
        return payments['ATM'];
      case 'money':
        return payments['MONEY'];
      case 'transfer':
      default:
        return payments['TRANSFER'];
    }
  }
}
