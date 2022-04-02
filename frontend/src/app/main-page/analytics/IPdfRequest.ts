import { IHttpPdfParams } from '../student/printout/IHttpPdfParams';

export interface IPdfRequest extends IHttpPdfParams {
  dateStart: Date;
  dateEnd: Date;
  removeIfWithoutNumer: boolean;
}
