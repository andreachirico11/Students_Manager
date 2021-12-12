import { renderFile } from 'ejs';
import { Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import { create, CreateOptions } from 'html-pdf';
import { join } from 'path';
import { HttpResponse } from '../models/httpResponse';
import { IPdfReceipt } from '../models/interfaces/IPdfReceipt';
import { IPdfRequest, IPdfStdRecapReq } from '../models/interfaces/IRequests';
import { IStudentPdfReqBody } from '../models/interfaces/IStudentPdfReqBody';
import { PdfMessages } from '../models/messageEnums';
import { PdfCreationErrorObj } from '../models/pdfCreationError';
import { ReceiptModel } from '../models/receiptModel';
import { generateHttpRes } from '../utils/httpRespGenerator';
import { sendErrorResponse } from '../utils/httpResWithErrorHeader';
import { ReceiptsMongoQueries } from '../utils/receiptsMongoQueries';

const fileOptions: CreateOptions = {
  format: 'A4',
  orientation: 'portrait',
  border: {
    top: '50px',
    bottom: '50px',
  },
};

// export function getStudentRecap(req: IPdfStdRecapReq, res: Response) {
//   const queries = new ReceiptsMongoQueries(req.body);
//   queries.allReceipts
//     .then((receipts: IPdfReceipt[]) => createHtmlFile(receipts, req.body.locale))
//     .then((htmlFile) => {
//       create(htmlFile as string, fileOptions).toFile('temp.pdf', function (err, file) {
//         if (err) {
//           // return handleError(err, res, PdfMessages.err_during_pdf_creation);
//         }
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('file-name', 'mega-printout');
//         res.sendFile(file.filename, function (err) {
//           if (err) {
//             // return handleError(err, res, PdfMessages.err_pdf_sending);
//           }
//           unlinkSync('temp.pdf');
//         });
//       });
//     })
//     .catch((e) => res.status(500).json(new HttpResponse(e, e)));
// }

export function getStudentRecap(req: IPdfStdRecapReq, res: Response) {
  const queries = new ReceiptsMongoQueries(req.body);
  queries.allReceipts
    .then((receipts: IPdfReceipt[]) => createHtmlFile(receipts, req.body.locale))
    .then((htmlFile) => {
      create(htmlFile as string, fileOptions).toFile('temp.pdf', function (err, file) {
        if (err) {
          // return handleError(err, res, PdfMessages.err_during_pdf_creation);
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('file-name', 'mega-printout');
        res.sendFile(file.filename, function (err) {
          if (err) {
            // return handleError(err, res, PdfMessages.err_pdf_sending);
          }
          unlinkSync('temp.pdf');
        });
      });
    })
    .catch((e: PdfCreationErrorObj) => sendErrorResponse(res, 500, e.type));
}

function createHtmlFile(
  receipts: IPdfReceipt[],
  locale: string
): Promise<string | PdfCreationErrorObj> {
  return new Promise<string | PdfCreationErrorObj>((res, rej) => {
    renderFile(
      getFilePathIntoPdfFolder('views', 'full-table.ejs'),
      {
        receipts,
        withStudentName: false,
        translations: getParsedTranslations(locale),
      },
      function (err, htmlFile) {
        if (err) {
          rej(new PdfCreationErrorObj(PdfMessages.err_pdf_ejs, err));
        }
        res(htmlFile);
      }
    );
  });
}

function switchQueryAccordingToParams(params: IStudentPdfReqBody) {
  // TODO
}

export function getPdf(req: IPdfRequest, res: Response) {
  // const queries = new ReceiptsMongoQueries(req.body);
  // queries.allReceipts
  //   .then((receipts: IPdfReceipt[]) => {
  //     renderFile(
  //       getFilePathIntoPdfFolder('views', 'full-table.ejs'),
  //       { receipts, withStudentName: true, translations: getParsedTranslations(req.query.locale) },
  //       function (err, htmlFile) {
  //         if (err) {
  //           return handleError(err, res, PdfMessages.err_pdf_ejs);
  //         }
  //         create(htmlFile, fileOptions).toFile('temp.pdf', function (err, file) {
  //           if (err) {
  //             return handleError(err, res, PdfMessages.err_during_pdf_creation);
  //           }
  //           res.setHeader('Content-Type', 'application/pdf');
  //           res.setHeader('file-name', 'mega-printout');
  //           res.sendFile(file.filename, function (err) {
  //             if (err) {
  //               return handleError(err, res, PdfMessages.err_pdf_sending);
  //             }
  //             unlinkSync('temp.pdf');
  //           });
  //         });
  //       }
  //     );
  //   })
  //   .catch((e) => handleError(e, res, PdfMessages.err_pdf_fetching_data));
}

function getFilePathIntoPdfFolder(...fileNames: string[]): string {
  return join(__dirname, '..', '..', 'pdf', ...fileNames);
}

function getParsedTranslations(locale: string) {
  return JSON.parse(
    readFileSync(getFilePathIntoPdfFolder('translations', (locale || 'en') + '.json'), 'utf8')
  );
}

function handleError(err: PdfCreationErrorObj, res: Response) {
  if (err) {
    console.log(err.type, err);
    return generateHttpRes(res, 500, err.type);
  }
}
