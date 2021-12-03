import { IHttpPdfParams } from './IHttpPdfParams';

export interface IStudentPdfParas extends IHttpPdfParams {
  columns: string[];
  orderBy: null;
  filters: null;
  _studentid: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
