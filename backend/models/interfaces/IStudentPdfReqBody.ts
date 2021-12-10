export interface IStudentPdfReqBody {
  _studentId: string;
  locale: string;
  columns: string[];
  orderBy?: string;
  filters?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
