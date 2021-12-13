export interface IStudentPdfReqBody {
  locale: string;
  _studentId: string;
  columns: string[];
  orderBy?: string;
  ascending: boolean;
  filters?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
