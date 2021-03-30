import { Parent } from './Parent';

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
    public receiptsId: string[],
    public notes?: string
  ) {}
}
