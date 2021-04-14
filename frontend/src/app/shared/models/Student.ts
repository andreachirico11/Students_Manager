import { Parent } from './Parent';
import { Receipt } from './Receipts';

export class Student {
  constructor(
    public id: string,
    public name: string,
    public surname: string,
    public schoolClass: string,
    public dateOfBirth: Date,
    public fiscalCode: string,
    public address: string,
    public parens: Parent[],
    public receipts: Receipt[],
    public notes?: string
  ) {}
}
