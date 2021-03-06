import { Parent } from './Parent';
import { ReceiptPrice } from './ReceiptPrice';
import { Receipt } from './Receipts';

export class Student {
  constructor(
    public name: string,
    public surname: string,
    public parent: Parent,
    public receipts: Receipt[],
    public isWithRec: boolean,
    public dateOfBirth?: Date,
    public phoneNumber?: number,
    public fiscalCode?: string,
    public schoolClass?: string,
    public address?: string,
    public notes?: string,
    public receiptPrice?: ReceiptPrice,
    public id?: string
  ) {}
}
