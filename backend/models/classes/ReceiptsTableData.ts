import { IPdfReceipt } from '../interfaces/IPdfReceipt';
import { IPdfTableTotals } from '../interfaces/IPdfTableTotals';
import { FullTableData } from './FullTableData';

export class ReceiptTableData extends FullTableData {
  constructor(
    receipts: IPdfReceipt[],
    translations: string,
    totals: IPdfTableTotals | null,
    todayDate: string,
    intervalTitle: string | undefined
  ) {
    super(receipts, translations, null, [], totals, todayDate, true, true, true, intervalTitle);
  }
}
