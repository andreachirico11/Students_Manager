import { Response } from 'express';
import { readFile, unlinkSync } from 'fs';
import { create } from 'html-pdf';
import { join } from 'path';
import { IBackendRequest, IPdfRequest } from '../models/interfaces/IRequests';
import { renderFile } from 'ejs';

export function getPdf(eq: IBackendRequest<IPdfRequest>, res: Response) {
  // the path is calculated from inside the compiled folder
  res.setHeader('Content-Type', 'application/pdf');
  const fileName = 'pdf-wella.pdf';

  renderFile(
    join(__dirname, '..', '..', 'pdf-views', 'ejs-sample.ejs'),
    { title: 'bella li' },
    function (err, file) {
      handleError(err, 'ejs');
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
