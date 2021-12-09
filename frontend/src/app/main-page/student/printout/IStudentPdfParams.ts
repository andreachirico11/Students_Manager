import { IHttpPdfParams } from './IHttpPdfParams';

export interface IStudentPdfParas extends IHttpPdfParams {
  columns: string[];
  orderBy: string;
  filters: string[];
  _studentid: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
