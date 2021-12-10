export interface IStudentPdfReqBody {
  locale: string;
  _studentId: string;
  columns: string[];
  orderBy?: string;
  filters?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
