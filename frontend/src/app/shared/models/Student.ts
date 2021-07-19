import { Parent } from './Parent';
import { Receipt } from './Receipts';

export class Student {
  constructor(
    public name: string,
    public surname: string,
    public schoolClass: string,
    public dateOfBirth: Date,
    public phoneNumber: number,
    public parent: Parent,
    public receipts: Receipt[],
    public fiscalCode?: string,
    public address?: string,
    public notes?: string,
    public id?: string
  ) {}
}
