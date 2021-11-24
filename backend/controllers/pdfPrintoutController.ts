import { Response } from 'express';
import { readFile, unlinkSync } from 'fs';
import { create } from 'html-pdf';
import { join } from 'path';
import { IBackendRequest, IPdfRequest } from '../models/interfaces/IRequests';

export function getPdf(eq: IBackendRequest<IPdfRequest>, res: Response) {
  // the path is calculated from inside the compiled folder
  res.setHeader('Content-Type', 'application/pdf');
  const fileName = 'pdf-wella.pdf';
  readFile(
    join(__dirname, '..', '..', 'pdf-views', 'html-sample.html'),
    'utf-8',
    function (err, file) {
      handleError(err, 'reading');
      create(file).toFile(fileName, function (err, file) {
        handleError(err, 'creating');
        res.setHeader('file-name', 'mega-printout');
        res.sendFile(file.filename, function (err) {
          handleError(err, 'sending');
          unlinkSync(fileName);
        });
      });
    }
  );
}

function handleError(err, msg) {
  if (err) {
    console.log('err' + msg + ': ', err);
    throw err;
  }
}
