import { PaymentType } from './PaymentType';

export class Receipt {
  constructor(
    public amount: number,
    public emissionDate: Date,
    public number?: string,
    public typeOfPayment?: PaymentType,
    public paymentDate?: Date,
    public id?: string
  ) {}
}
