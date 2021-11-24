import { Response } from 'express';
import { readFile, unlinkSync } from 'fs';
import { create } from 'html-pdf';
import { join } from 'path';
import { IBackendRequest, IPdfRequest } from '../models/interfaces/IRequests';
import { renderFile } from 'ejs';
import { ReceiptModel } from '../models/receiptModel';
import { IReceipt } from '../models/interfaces/Receipt';
import { generateHttpRes } from '../utils/httpRespGenerator';
import { IPdfReceipt } from '../models/interfaces/IPdfReceipt';

export function getPdf(eq: IBackendRequest<IPdfRequest>, res: Response) {
  // the path is calculated from inside the compiled folder
  res.setHeader('Content-Type', 'application/pdf');
  const fileName = 'pdf-wella.pdf';

  ReceiptModel.find()
    .then((receipts: IReceipt[]) => {
      renderFile(
        join(__dirname, '..', '..', 'pdf-views', 'full-table.ejs'),
        { receipts: parseReceipts(receipts) },
        function (err, file) {
          handleError(err, 'ejs');
          create(file, {
            format: 'A4',
            orientation: 'portrait',
            border: {
              top: '50px',
              bottom: '50px',
            },
          }).toFile(fileName, function (err, file) {
            handleError(err, 'creating');
            res.setHeader('file-name', 'mega-printout');
            res.sendFile(file.filename, function (err) {
              handleError(err, 'sending');
              unlinkSync(fileName);
            });
          });
        }
      );
    })
    .catch(() => generateHttpRes(res, 500, 'cannot create pdf'));
}

function handleError(err, msg) {
  if (err) {
    console.log('err' + msg + ': ', err);
    throw err;
  }
}

function parseReceipts(recs: IReceipt[]): IPdfReceipt[] {
  return recs.map((r) => ({
    number: r.number,
    amount: r.amount,
    emissionDate: r.emissionDate,
    paymentDate: r.paymentDate,
    typeOfPayment: r.typeOfPayment,
    emissionDateString: r.emissionDate ? new Date(r.emissionDate).toDateString() : '',
    paymentDateString: r.paymentDate ? new Date(r.paymentDate).toDateString() : '',
  }));
}
