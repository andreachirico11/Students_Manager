import { renderFile } from 'ejs';
import { Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import { create, CreateOptions, FileInfo } from 'html-pdf';
import { join } from 'path';
import { IPdfReceipt } from '../models/interfaces/IPdfReceipt';
import { IPdfRequest, IPdfStdRecapReq } from '../models/interfaces/IRequests';
import { IStudentPdfReqBody } from '../models/interfaces/IStudentPdfReqBody';
import { IMongoStudent } from '../models/interfaces/Student';
import { ITeacher } from '../models/interfaces/Teacher';
import { PdfMessages } from '../models/messageEnums';
import { PdfCreationErrorObj } from '../models/pdfCreationError';
import { ReceiptsFilters } from '../models/receiptsFilters';
import { getEnvVariables } from '../utils/getEnv';
import { sendErrorResponse } from '../utils/httpResWithErrorHeader';
import { ReceiptsMongoQueries } from './mongoQueries/receiptsMongoQueries';
import { StudentMongoQueries } from './mongoQueries/studentstsMongoQueries';
import { TeacherMongoQueries } from './mongoQueries/teachersMongoQueries';
import { NumberFormat } from 'intl';
import { ILocalizedReceiptPrice, IReceiptPrice } from '../models/interfaces/IReceiptPrice';

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
    const receiptsTotals = req.body.withTotal ? getTotals(receipts) : null;
    const htmlFile = (await createHtmlFile(receipts, req.body, student, receiptsTotals)) as string;
    const file = (await createPdfFile(htmlFile, fileOptions)) as FileInfo;
    await sendFile(res, file, getFileTitle(student));
    unlinkSync(TEMPORARY_PDF_NAME);
  } catch (e) {
    handleError(e, res);
  }
}

export async function getStudentBlankRec(req: IPdfRequest, res: Response) {
  const teacherIdName = getEnvVariables().TEACHER_ID_NAME;
  try {
    if (!teacherIdName) {
      throw new PdfCreationErrorObj(PdfMessages.blank_page_not_allowed, '');
    }
    const teacher = await new TeacherMongoQueries().teacherByIdName(teacherIdName);
    const student = await new StudentMongoQueries().studentById(req.params.id);
    if (!teacher || !student) {
      throw new PdfCreationErrorObj(PdfMessages.teacher_or_student_not_found, '');
    }
    const htmlFile = (await createBlankRecHtmlFile(student, teacher, req.query.locale)) as string;
    const file = (await createPdfFile(htmlFile, {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '0',
        bottom: '0',
      },
    })) as FileInfo;
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

function getTotals(receipts: IPdfReceipt[]): { payed?: number; notPayed?: number } {
  let payed = 0,
    notPayed = 0;
  receipts.forEach((rec) => {
    if (rec.amount)
      if (rec.paymentDate) {
        payed += rec.amount;
      } else {
        notPayed += rec.amount;
      }
  });
  const output = {};
  if (payed > 0) {
    output['payed'] = payed;
  }
  if (notPayed > 0) {
    output['notPayed'] = notPayed;
  }
  return output;
}

function createHtmlFile(
  receipts: IPdfReceipt[],
  params: IStudentPdfReqBody,
  student?: IMongoStudent,
  totals?: { payed?: number; notPayed?: number } | null
): Promise<string | PdfCreationErrorObj> {
  return new Promise<string | PdfCreationErrorObj>((res, rej) => {
    renderFile(
      getFilePathIntoPdfFolder('views', 'full-table.ejs'),
      {
        receipts: parseAmoutsToLocale(receipts, params.locale),
        withStudentName: false,
        translations: getParsedTranslations(params.locale),
        student,
        params,
        totals,
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

function createBlankRecHtmlFile(
  student: IMongoStudent,
  teacher: ITeacher,
  locale: string
): Promise<string | PdfCreationErrorObj> {
  return new Promise<string | PdfCreationErrorObj>((res, rej) => {
    renderFile(
      getFilePathIntoPdfFolder('views', teacher.idName + '.ejs'),
      {
        student,
        teacher,
        localizedReceiptPrice: parseReceiptpriceToLocale(student.receiptPrice, locale),
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

function createPdfFile(
  htmlFile: string,
  fileOptions: CreateOptions
): Promise<FileInfo | PdfCreationErrorObj> {
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

function parseAmoutsToLocale(recs: IPdfReceipt[], locale: string): IPdfReceipt[] {
  const format = NumberFormat(locale).format;
  return recs.map((r) => ({
    ...r,
    localizedAmount: format(r.amount),
  }));
}

function parseReceiptpriceToLocale(
  rp: IReceiptPrice | undefined,
  locale: string
): ILocalizedReceiptPrice {
  if (!rp) {
    return {
      price: '',
      tax: '',
      total: '',
    };
  }
  const format = NumberFormat(locale).format;
  return {
    price: format(rp.price),
    tax: format(rp.tax),
    total: format(rp.total),
  };
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
