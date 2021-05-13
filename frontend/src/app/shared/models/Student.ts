import { Parent } from './Parent';
import { Receipt } from './Receipts';

export class Student {
  constructor(
    public name: string,
    public surname: string,
    public schoolClass: string,
    public dateOfBirth: Date,
    public fiscalCode: string,
    public address: string,
    public parent: Parent,
    public receipts: Receipt[],
    public notes?: string,
    public id?: string
  ) {}
}
