export interface IStudentPdfReqBody {
  _studentId: string;
  locale: string;
  columns: string[];
  ascending: boolean;
  orderBy?: string;
  filters?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
