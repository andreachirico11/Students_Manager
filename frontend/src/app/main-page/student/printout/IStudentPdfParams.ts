import { IHttpPdfParams } from './IHttpPdfParams';

export interface IStudentPdfParas extends IHttpPdfParams {
  _studentid: string;
  columns: string[];
  orderBy?: string;
  filters?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}
