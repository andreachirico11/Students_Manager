import { IPdfReceipt } from '../interfaces/IPdfReceipt';
import { IPdfTableTotals } from '../interfaces/IPdfTableTotals';
import { IMongoStudent } from '../interfaces/Student';

export class FullTableData {
  constructor(
    public receipts: IPdfReceipt[],
    public translations: string,
    public student: IMongoStudent | null,
    public columns: string[],
    public totals: IPdfTableTotals | null,
    public todayDate: string,
    public printAllCols: boolean,
    public fullScreen: boolean,
    public withStudentName: boolean,
    public intervalTitle: string | undefined
  ) {}
}
