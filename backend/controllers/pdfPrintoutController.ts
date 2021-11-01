import { Response } from 'express';
import { join } from 'path';
import { IBackendRequest, IPdfRequest } from '../models/interfaces/IRequests';

export function getPdf(eq: IBackendRequest<IPdfRequest>, res: Response) {
  res.setHeader('Content-Type', 'application/pdf');
  // the path is calculated from inside the compiled folder
  res.sendFile(join(__dirname, '..', '..', 'pdf-views', 'pdf-sample.pdf'), function (err) {
    if (err) {
      console.log('err: ', err);
    } else {
      console.log('success');
    }
  });
}
