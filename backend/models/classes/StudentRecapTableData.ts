import { IPdfReceipt } from '../interfaces/IPdfReceipt';
import { IPdfTableTotals } from '../interfaces/IPdfTableTotals';
import { IMongoStudent } from '../interfaces/Student';
import { FullTableData } from './FullTableData';

export class StudentRecapTableData extends FullTableData {
  constructor(
    receipts: IPdfReceipt[],
    translations: string,
    student: IMongoStudent | null,
    columns: string[],
    totals: IPdfTableTotals | null,
    todayDate: string
  ) {
    super(
      receipts,
      translations,
      student,
      columns,
      totals,
      todayDate,
      false,
      false,
      false,
      undefined
    );
  }
}
