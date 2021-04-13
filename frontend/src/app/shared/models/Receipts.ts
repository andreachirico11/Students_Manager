import { PaymentType } from './PaymentType';

export class Receipt {
  constructor(
    public id: string,
    public number: string,
    public amount: number,
    public emissionDate: Date,
    public paymentDate: Date,
    public typeOfPayment: PaymentType
  ) {}
}
