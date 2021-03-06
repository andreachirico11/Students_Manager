import { IReceipt } from './Receipt';

export interface IPdfReceipt extends IReceipt {
  paymentDateString?: string;
  emissionDateString?: string;
  localizedAmount?: string;
  studentName: string;
}
