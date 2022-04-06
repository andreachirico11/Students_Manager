import { ReceiptsFilters } from '../receiptsFilters';
import { IHttpPdfParams } from './IHttpPdfParams';

export interface IStudentPdfReqBody extends IHttpPdfParams {
  _studentId: string;
  columns: string[];
  ascending: boolean;
  withTotal: boolean;
  orderBy?: string;
  filters?: ReceiptsFilters[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}
