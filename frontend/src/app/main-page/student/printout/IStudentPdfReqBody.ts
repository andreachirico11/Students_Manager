import { ReceiptsFilters } from 'src/app/shared/models/receiptsFilters';

export interface IStudentPdfReqBody {
  locale: string;
  _studentId: string;
  columns: string[];
  orderBy?: string;
  ascending: boolean;
  filters?: ReceiptsFilters[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
