import { renderFile } from 'ejs';
import { Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import { create } from 'html-pdf';
import { join } from 'path';
import { IPdfReceipt } from '../models/interfaces/IPdfReceipt';
import { IPdfRequest } from '../models/interfaces/IRequests';
import { PdfMessages } from '../models/messageEnums';
import { ReceiptModel } from '../models/receiptModel';
import { generateHttpRes } from '../utils/httpRespGenerator';

export function getPdf(req: IPdfRequest, res: Response) {
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
        paymentDateString: {
          $dateToString: { format: '%d %m %Y', date: '$paymentDate' },
        },
        emissionDateString: {
          $dateToString: { format: '%d %m %Y', date: '$emissionDate' },
        },
      },
    },
  ])
    .then((receipts: IPdfReceipt[]) => {
      renderFile(
        getFilePathIntoPdfFolder('views', 'full-table.ejs'),
        { receipts, withStudentName: true, translations: getParsedTranslations(req.query.locale) },
        function (err, htmlFile) {
          if (err) {
            return handleError(err, res, PdfMessages.err_pdf_ejs);
          }
          create(htmlFile, {
            format: 'A4',
            orientation: 'portrait',
            border: {
              top: '50px',
              bottom: '50px',
            },
          }).toFile('temp.pdf', function (err, file) {
            if (err) {
              return handleError(err, res, PdfMessages.err_during_pdf_creation);
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('file-name', 'mega-printout');
            res.sendFile(file.filename, function (err) {
              if (err) {
                return handleError(err, res, PdfMessages.err_pdf_sending);
              }
              unlinkSync('temp.pdf');
            });
          });
        }
      );
    })
    .catch((e) => handleError(e, res, PdfMessages.err_pdf_fetching_data));
}

function getFilePathIntoPdfFolder(...fileNames: string[]): string {
  return join(__dirname, '..', '..', 'pdf', ...fileNames);
}

function getParsedTranslations(locale: string) {
  return JSON.parse(
    readFileSync(getFilePathIntoPdfFolder('translations', (locale || 'en') + '.json'), 'utf8')
  );
}

function handleError(err, res: Response, message: PdfMessages) {
  if (err) {
    console.log(message);

    return generateHttpRes(res, 500, message);
  }
}
