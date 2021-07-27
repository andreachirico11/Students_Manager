import { Injectable } from '@angular/core';
import { Receipt } from 'src/app/shared/models/Receipts';

@Injectable({
  providedIn: 'root',
})
export class ReceiptTotalsService {
  totalPayed(receipts: Receipt[]): number {
    return this.filterAndMakeTotal(receipts, (r) => !!r.paymentDate);
  }

  totalUnpayed(receipts: Receipt[]): number {
    return this.filterAndMakeTotal(receipts, (r) => !r.paymentDate);
  }

  currentMonthPayed(receipts: Receipt[]): number {
    const actualMonth = new Date().getMonth();
    return this.filterAndMakeTotal(
      receipts,
      (r) => r.paymentDate && new Date(r.paymentDate).getMonth() === actualMonth
    );
  }

  private filterAndMakeTotal(receipts: Receipt[], condictionCb: (r: Receipt) => boolean): number {
    return receipts.filter(condictionCb).reduce((prev, next) => prev + next.amount, 0);
  }
}
