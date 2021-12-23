import { ReceiptsFilters } from 'src/app/shared/models/receiptsFilters';

export interface IStudentPdfReqBody {
  locale: string;
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
