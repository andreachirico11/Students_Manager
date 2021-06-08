import { Receipt } from 'src/app/shared/models/Receipts';

export interface IReceiptForTable extends Receipt {
  payed: boolean;
}
