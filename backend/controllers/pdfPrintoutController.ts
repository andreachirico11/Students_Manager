import { renderFile } from 'ejs';
import { Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import { create, CreateOptions, FileInfo } from 'html-pdf';
import { join } from 'path';
import { IPdfReceipt } from '../models/interfaces/IPdfReceipt';
import { IPdfRequest, IPdfStdRecapReq } from '../models/interfaces/IRequests';
import { IStudentPdfReqBody } from '../models/interfaces/IStudentPdfReqBody';
import { IMongoStudent } from '../models/interfaces/Student';
import { PdfMessages } from '../models/messageEnums';
import { PdfCreationErrorObj } from '../models/pdfCreationError';
import { ReceiptsFilters } from '../models/receiptsFilters';
import { sendErrorResponse } from '../utils/httpResWithErrorHeader';
import { ReceiptsMongoQueries } from './mongoQueries/receiptsMongoQueries';
import { StudentMongoQueries } from './mongoQueries/studentstsMongoQueries';

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
    verifyReqParams(req.body);
    const student = (await new StudentMongoQueries().studentById(
      req.body._studentId
    )) as IMongoStudent;
    const allRecsQueries = new ReceiptsMongoQueries();
    const receipts = await allRecsQueries.receiptsForStudentWithParams(req.body);
    const total = req.body.withTotal ? calculateTotal(receipts) : null;
    const htmlFile = (await createHtmlFile(receipts, req.body, student, total)) as string;
    const file = (await createPdfFile(htmlFile)) as FileInfo;
    await sendFile(res, file, getFileTitle(student));
    unlinkSync(TEMPORARY_PDF_NAME);
  } catch (e) {
    handleError(e, res);
  }
}

function verifyReqParams(params: IStudentPdfReqBody) {
  if (
    params.columns.length === 0 ||
    (params.orderBy && !params.columns.find((c) => c === params.orderBy)) ||
    (params.filters?.includes(ReceiptsFilters.dateRange) &&
      params.filters?.includes(ReceiptsFilters.thisYear)) ||
    (params.filters?.includes(ReceiptsFilters.dateRange) &&
      params.filters?.includes(ReceiptsFilters.thisMonth)) ||
    (params.filters?.includes(ReceiptsFilters.thisMonth) &&
      params.filters?.includes(ReceiptsFilters.thisYear))
  ) {
    throw new PdfCreationErrorObj(PdfMessages.err_in_pdf_req_params, '');
  }
}

function calculateTotal(rs: IPdfReceipt[]): number {
  return rs.reduce((acc, current) => acc + current.amount, 0);
}

function createHtmlFile(
  receipts: IPdfReceipt[],
  params: IStudentPdfReqBody,
  student?: IMongoStudent,
  total?: number | null
): Promise<string | PdfCreationErrorObj> {
  return new Promise<string | PdfCreationErrorObj>((res, rej) => {
    renderFile(
      getFilePathIntoPdfFolder('views', 'full-table.ejs'),
      {
        receipts,
        withStudentName: false,
        translations: getParsedTranslations(params.locale),
        student,
        params,
        total,
        todayDate: getTodayDate(),
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

function getTodayDate() {
  return new Date().toISOString().split('T')[0].split('-').reverse().join('/');
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

function getFileTitle(s: IMongoStudent): string {
  const date = new Date();
  return `${s.name} ${s.surname} (${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()})`;
}

function handleError(err: PdfCreationErrorObj, res: Response) {
  if (err) {
    console.log('\n\n\n\n\n\n');
    console.log(err.type);
    console.log('');
    console.log(err.err);
    return sendErrorResponse(res, 500, err.type);
  }
}

export function getPdf(req: IPdfRequest, res: Response) {
  // TODO for all receipts
}
