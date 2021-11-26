import { renderFile } from 'ejs';
import { Response } from 'express';
import { unlinkSync } from 'fs';
import { create } from 'html-pdf';
import { join } from 'path';
import { IPdfReceipt } from '../models/interfaces/IPdfReceipt';
import { IBackendRequest, IPdfRequest } from '../models/interfaces/IRequests';
import { IReceipt } from '../models/interfaces/Receipt';
import { PdfMessages } from '../models/messageEnums';
import { ReceiptModel } from '../models/receiptModel';
import { generateHttpRes } from '../utils/httpRespGenerator';

export function getPdf(eq: IBackendRequest<IPdfRequest>, res: Response) {
  // the path is calculated from inside the compiled folder
  res.setHeader('Content-Type', 'application/pdf');
  const fileName = 'pdf-wella.pdf';

  ReceiptModel.aggregate([
    {
      $lookup: {
        from: 'students',
        localField: '_studentId',
        foreignField: '_id',
        as: 'studentInfo',
      },
    },
    {
      $unwind: '$studentInfo',
    },
    {
      $addFields: {
        studentName: {
          $concat: ['$studentInfo.name', ' ', '$studentInfo.surname'],
        },
      },
    },
  ])
    .then((receipts: IReceipt[]) => {
      console.log(receipts);

      renderFile(
        join(__dirname, '..', '..', 'pdf-views', 'full-table.ejs'),
        { receipts: parseReceipts(receipts) },
        function (err, file) {
          handleError(err, res, PdfMessages.err_pdf_ejs);
          create(file, {
            format: 'A4',
            orientation: 'portrait',
            border: {
              top: '50px',
              bottom: '50px',
            },
          }).toFile(fileName, function (err, file) {
            handleError(err, res, PdfMessages.err_during_pdf_creation);
            res.setHeader('file-name', 'mega-printout');
            res.sendFile(file.filename, function (err) {
              handleError(err, res, PdfMessages.err_pdf_sending);
              unlinkSync(fileName);
            });
          });
        }
      );
    })
    .catch((e) => handleError(e, res, PdfMessages.err_pdf_fetching_data));
}

function handleError(err, res: Response, message: PdfMessages) {
  if (err) {
    return generateHttpRes(res, 500, message);
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
