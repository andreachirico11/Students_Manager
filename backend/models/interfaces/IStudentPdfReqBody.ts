import { ReceiptsFilters } from '../receiptsFilters';

export interface IStudentPdfReqBody {
  _studentId: string;
  locale: string;
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
