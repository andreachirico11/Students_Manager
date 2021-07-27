import { TestBed } from '@angular/core/testing';
import { Receipt } from 'src/app/shared/models/Receipts';

import { ReceiptTotalsService } from './receipt-totals.service';

const testReceipts: Receipt[] = [
  {
    amount: 34,
    emissionDate: new Date('2021-07-21T22:00:00.000Z'),
    id: '61001a56fc4d9743e44ad5a1',
    number: '',
    paymentDate: null,
    typeOfPayment: null,
  },
  {
    amount: 5555,
    emissionDate: new Date('2021-07-13T22:00:00.000Z'),
    id: '6100297bfc4d9743e44ad5a2',
    number: '22',
    paymentDate: null,
    typeOfPayment: null,
  },
  {
    amount: 31231,
    emissionDate: new Date('2021-06-09T22:00:00.000Z'),
    id: '61002988fc4d9743e44ad5a3',
    number: '',
    paymentDate: null,
    typeOfPayment: null,
  },
  {
    amount: 333,
    emissionDate: new Date('2021-07-26T22:00:00.000Z'),
    id: '610029a3fc4d9743e44ad5a4',
    number: 'absasd',
    paymentDate: new Date('2021-07-29T22:00:00.000Z'),
    typeOfPayment: 'money',
  },
];

describe('ReceiptTotalsService', () => {
  let service: ReceiptTotalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptTotalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('can make a total', () => {
    let total = 0;
    testReceipts.forEach((r) => {
      if (r.paymentDate) {
        total += r.amount;
      }
    });
    expect(service.totalPayed(testReceipts)).toBe(total);
  });

  it('can count the unpayed ones', () => {
    let total = 0;
    testReceipts.forEach((r) => {
      if (!r.paymentDate) {
        total += r.amount;
      }
    });
    expect(service.totalUnpayed(testReceipts)).toBe(total);
  });

  it('it returns this month total payed', () => {
    let total = 0;
    testReceipts.forEach((r) => {
      if (r.paymentDate && r.paymentDate.getMonth() === new Date().getMonth()) {
        total += r.amount;
      }
    });
    expect(service.currentMonthPayed(testReceipts)).toBe(total);
  });
});
