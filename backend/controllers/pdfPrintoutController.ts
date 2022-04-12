import { Data, renderFile } from 'ejs';
import { Response } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import { create, CreateOptions, FileInfo } from 'html-pdf';
import { join } from 'path';
import { IPdfReceipt } from '../models/interfaces/IPdfReceipt';
import { IPdfReqAllReceipts, IPdfRequest, IPdfStdRecapReq } from '../models/interfaces/IRequests';
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
import { ReceiptTableData } from '../models/classes/ReceiptsTableData';
import { StudentRecapTableData } from '../models/classes/StudentRecapTableData';
import { IPdfTableTotals } from '../models/interfaces/IPdfTableTotals';
import { TEMPORARY_PDF_NAME, fileOptions } from '../utils/pdfFileVariables';

export async function getStudentRecap(req: IPdfStdRecapReq, res: Response) {
  try {
    verifyReqParams(req.body);
    const student = (await new StudentMongoQueries().studentById(
      req.body._studentId
    )) as IMongoStudent;
    const allRecsQueries = new ReceiptsMongoQueries(req.body.timezoneOffset);
    const receipts = await allRecsQueries.receiptsForStudentWithParams(req.body);
    const receiptsTotals = req.body.withTotal ? getTotals(receipts) : null;
    const htmlFile = (await createHtmlFileForStudentRecap(
      receipts,
      req.body.columns,
      req.body.locale || 'en',
      student,
      receiptsTotals
    )) as string;
    const file = (await createPdfFile(htmlFile, fileOptions)) as FileInfo;
    await sendFile(res, file, getFileTitle(student));
    unlinkSync(TEMPORARY_PDF_NAME);
  } catch (e) {
    handleError(e, res);
  }
}

export async function getAllRecs(req: IPdfReqAllReceipts, res: Response) {
  const { locale, dateEnd, dateStart, removeIfWithoutNumber, removeIfWithNumber } = req.body;
  try {
    if (!dateEnd || !dateStart) {
      throw new PdfCreationErrorObj(PdfMessages.pdf_receipts_missing_params, '');
    }
    const allRecsQueries = new ReceiptsMongoQueries(req.body.timezoneOffset);
    const filteredReceipts = await (removeIfWithoutNumber
      ? allRecsQueries.allReceiptsFilteredByDateAndNumberPresence(dateStart, dateEnd)
      : removeIfWithNumber
      ? allRecsQueries.allReceiptsFilteredByDateAndNumberAbsence(dateStart, dateEnd)
      : allRecsQueries.allReceiptsFilteredByDate(dateStart, dateEnd));
    const intervalTitle = getDateIntervalFiletitle(dateStart, dateEnd);
    const htmlFile = (await createHtmlFileForReceipts(
      filteredReceipts,
      locale,
      getTotals(filteredReceipts),
      intervalTitle
    )) as string;
    const file = (await createPdfFile(htmlFile, fileOptions)) as FileInfo;
    await sendFile(res, file, intervalTitle);
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
    const htmlFile = (await createBlankRecHtmlFile(
      student,
      teacher,
      req.query.locale || 'en'
    )) as string;
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

function createHtmlFileForStudentRecap(
  receipts: IPdfReceipt[],
  columns: string[],
  locale: string,
  student?: IMongoStudent,
  totals?: IPdfTableTotals | null
): Promise<string | PdfCreationErrorObj> {
  return renderTheFile(
    new StudentRecapTableData(
      parseAmoutsToLocale(receipts, locale),
      getParsedTranslations(locale),
      student ?? null,
      columns,
      totals ?? null,
      getTodayDate()
    ),
    getFilePathIntoPdfFolder('views', 'full-table.ejs')
  );
}

function createHtmlFileForReceipts(
  receipts: IPdfReceipt[],
  locale: string,
  totals: IPdfTableTotals | null,
  intervalTitle?: string
): Promise<string | PdfCreationErrorObj> {
  return renderTheFile(
    new ReceiptTableData(
      parseAmoutsToLocale(receipts, locale),
      getParsedTranslations(locale),
      totals,
      getTodayDate(),
      intervalTitle
    ),
    getFilePathIntoPdfFolder('views', 'full-table.ejs')
  );
}

function getTotals(receipts: IPdfReceipt[]): IPdfTableTotals {
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

function createBlankRecHtmlFile(
  student: IMongoStudent,
  teacher: ITeacher,
  locale: string
): Promise<string | PdfCreationErrorObj> {
  return renderTheFile(
    {
      student,
      teacher,
      localizedReceiptPrice: parseReceiptpriceToLocale(student.receiptPrice, locale),
    },
    getFilePathIntoPdfFolder('views', teacher.idName + '.ejs')
  );
}

function renderTheFile(data: Data, filePath: string): Promise<string | PdfCreationErrorObj> {
  return new Promise<string | PdfCreationErrorObj>((res, rej) => {
    renderFile(filePath, { ...data }, function (err, htmlFile) {
      if (err) {
        rej(new PdfCreationErrorObj(PdfMessages.err_pdf_ejs, err));
      }
      res(htmlFile);
    });
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

function getTodayDate() {
  return new Date().toISOString().split('T')[0].split('-').reverse().join('/');
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

function getDateIntervalFiletitle(start: Date, end: Date) {
  return `${removeDayName(new Date(start).toDateString())} - ${removeDayName(
    new Date(end).toDateString()
  )}`;
}

function removeDayName(dateString: string) {
  return dateString.split(' ').slice(1).join(' ');
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
