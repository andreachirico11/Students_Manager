import { renderFile } from 'ejs';
import { Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import { create, CreateOptions, FileInfo } from 'html-pdf';
import { join } from 'path';
import { IPdfReceipt } from '../models/interfaces/IPdfReceipt';
import { IPdfRequest, IPdfStdRecapReq } from '../models/interfaces/IRequests';
import { IStudentPdfReqBody } from '../models/interfaces/IStudentPdfReqBody';
import { PdfMessages } from '../models/messageEnums';
import { PdfCreationErrorObj } from '../models/pdfCreationError';
import { sendErrorResponse } from '../utils/httpResWithErrorHeader';
import { ReceiptsMongoQueries } from '../utils/receiptsMongoQueries';

const TEMPORARY_PDF_NAME = 'temp.pdf';

const fileOptions: CreateOptions = {
  format: 'A4',
  orientation: 'portrait',
  border: {
    top: '50px',
    bottom: '50px',
  },
};

export async function getStudentRecap(req: IPdfStdRecapReq, res: Response) {
  try {
    const receipts = await switchQueryAccordingToParams(req.body);
    const htmlFile = (await createHtmlFile(receipts, req.body.locale)) as string;
    const file = (await createPdfFile(htmlFile)) as FileInfo;
    await sendFile(res, file, 'mega_title');
    unlinkSync(TEMPORARY_PDF_NAME);
  } catch (e) {
    handleError(e, res);
  }
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

async function switchQueryAccordingToParams(params: IStudentPdfReqBody): Promise<IPdfReceipt[]> {
  const queries = new ReceiptsMongoQueries(params);
  return queries.allReceipts;
  if (params.filters && params.dateRange && params.orderBy) {
    // TODO
  } else if (params.filters && params.dateRange && !params.orderBy) {
    // TODO
  } else if (params.filters && !params.dateRange && params.orderBy) {
    // TODO
  } else if (!params.filters && !params.dateRange && params.orderBy) {
    // TODO
  } else if (params.filters && !params.dateRange && !params.orderBy) {
    // TODO
  } else {
    // TODO
  }
}

function createPdfFile(htmlFile: string): Promise<FileInfo | PdfCreationErrorObj> {
  return new Promise((res, rej) => {
    create(htmlFile as string, fileOptions).toFile(TEMPORARY_PDF_NAME, function (err, file) {
      if (err) {
        rej(new PdfCreationErrorObj(PdfMessages.err_during_pdf_creation, err));
      }
      res(file);
    });
  });
}

function sendFile(res: Response, file: FileInfo, title: string): Promise<null | Error> {
  return new Promise((resolve, rej) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('file-name', title);
    res.sendFile(file.filename, function (err) {
      if (err) {
        rej(new PdfCreationErrorObj(PdfMessages.err_pdf_sending, err));
      }
      resolve(null);
    });
  });
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
    return sendErrorResponse(res, 500, err.type);
  }
}

export function getPdf(req: IPdfRequest, res: Response) {}
