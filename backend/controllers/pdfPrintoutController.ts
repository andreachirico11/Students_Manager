import { Response } from 'express';
import { join } from 'path';
import { IBackendRequest, IPdfRequest } from '../models/interfaces/IRequests';
import { create } from 'html-pdf';
import { readFile, readFileSync } from 'fs';

export function getPdf(eq: IBackendRequest<IPdfRequest>, res: Response) {
  // the path is calculated from inside the compiled folder
  res.setHeader('Content-Type', 'application/pdf');

  readFile(join(__dirname, '..', '..', 'pdf-views', 'html-sample.html'), function (err, file) {
    if (err) {
      console.log('E R R O R:', err);
    }
    console.log(file);
  });

  return;

  res.sendFile(join(__dirname, '..', '..', 'pdf-views', 'pdf-sample.pdf'), function (err) {
    if (err) {
      console.log('err: ', err);
    } else {
      console.log('success');
    }
  });
}
