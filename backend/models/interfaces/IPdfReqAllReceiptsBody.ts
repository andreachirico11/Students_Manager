import { IHttpPdfParams } from './IHttpPdfParams';

export interface IPdfReqAllReceiptsBody extends IHttpPdfParams {
  locale: string;
  dateStart: Date;
  dateEnd: Date;
  removeIfWithoutNumber: boolean;
  removeIfWithNumber: boolean;
}
