import { ReceiptsFilters } from 'src/app/shared/models/receiptsFilters';
import { IHttpPdfParams } from './IHttpPdfParams';

export interface IStudentPdfReqBody extends IHttpPdfParams {
  _studentId: string;
  columns: string[];
  withTotal: boolean;
  ascending: boolean;
  orderBy?: string;
  filters?: ReceiptsFilters[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
