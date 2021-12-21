import { IPdfReceipt } from '../../models/interfaces/IPdfReceipt';
import { IStudentPdfReqBody } from '../../models/interfaces/IStudentPdfReqBody';
import { PdfMessages } from '../../models/messageEnums';
import { PdfCreationErrorObj } from '../../models/pdfCreationError';
import { ReceiptModel } from '../../models/receiptModel';
import { ReceiptsColNames } from '../../models/receiptsColNames';
import { ReceiptsFilters } from '../../models/receiptsFilters';

export class ReceiptsMongoQueries {
  get allReceipts(): Promise<IPdfReceipt[]> {
    // TODO refactor
    return ReceiptModel.aggregate([
      this.lookupForStudetInfo(),
      {
        $unwind: '$studentInfo',
      },
      {
        $addFields: {
          studentName: this.concatStudentName('studentInfo'),
          paymentDateString: this.dateToString(ReceiptsColNames.paymentDate),
          emissionDateString: this.dateToString(ReceiptsColNames.emissionDate),
        },
      },
    ]).catch((e) => {
      throw this.errHandling(e);
    });
  }

  receiptsForStudentWithParams(params: IStudentPdfReqBody): Promise<IPdfReceipt[]> {
    const aggregatePipeline: any[] = [];
    aggregatePipeline.push(this.matchByStudentId(params._studentId));
    if (params.filters && params.filters.length > 0) {
      this.applyFilters(params.filters, params.dateRange).forEach((matchFilter) => {
        aggregatePipeline.push(matchFilter);
      });
    }
    aggregatePipeline.push(this.projectDesiredColumns(params.columns));
    aggregatePipeline.push(this.addStringifiedDateFields());
    if (params.orderBy) {
      aggregatePipeline.push(this.sortBy(params.orderBy, params.ascending));
    }
    return ReceiptModel.aggregate(aggregatePipeline).catch((e) => {
      throw this.errHandling(e);
    });
  }

  private projectDesiredColumns(columns: string[]) {
    const projectObj = {};
    columns.forEach((col) => {
      projectObj[col] = 1;
    });
    return {
      $project: { ...projectObj },
    };
  }

  private lookupForStudetInfo() {
    return {
      $lookup: {
        from: 'students',
        localField: '_studentId',
        foreignField: '_id',
        as: 'studentInfo',
      },
    };
  }

  private concatStudentName(studentPropName: string) {
    return { $concat: ['$' + studentPropName + '.name', ' ', '$' + studentPropName + '.surname'] };
  }

  private matchByStudentId(id: string) {
    return { $match: { $expr: { $eq: ['$_studentId', { $toObjectId: id }] } } };
  }

  private applyFilters(
    filters: ReceiptsFilters[],
    dateRange?: {
      startDate: string;
      endDate: string;
    }
  ) {
    const matchFiltersArray: any[] = [];
    if (filters.includes(ReceiptsFilters.isPayed) || filters.includes(ReceiptsFilters.notPayed)) {
      matchFiltersArray.push(
        this.matchByPaymentExistence(filters.includes(ReceiptsFilters.isPayed))
      );
    }
    if (filters.includes(ReceiptsFilters.dateRange) && dateRange) {
      matchFiltersArray.push(
        this.matchByDateRange(new Date(dateRange.startDate), new Date(dateRange.endDate))
      );
    }
    if (filters.includes(ReceiptsFilters.thisMonth) || filters.includes(ReceiptsFilters.thisYear)) {
      const { start, end } = this.getActualYearOrMonthStartEnd(
        filters.includes(ReceiptsFilters.thisMonth)
      );
      matchFiltersArray.push(this.matchByDateRange(start, end));
    }
    return matchFiltersArray;
  }

  private addStringifiedDateFields() {
    return {
      $addFields: {
        paymentDateString: this.dateToString('paymentDate'),
        emissionDateString: this.dateToString('emissionDate'),
      },
    };
  }

  private sortBy(fieldName: string, inAScendingOrder: boolean) {
    const sortObj = {};
    sortObj[fieldName] = inAScendingOrder ? 1 : -1;
    return { $sort: sortObj };
  }

  private matchByPaymentExistence(isPayed: boolean) {
    const matchObj = {};
    matchObj[ReceiptsColNames.paymentDate] = isPayed ? { $ne: null } : { $eq: null };
    return { $match: matchObj };
  }

  private matchByDateRange(startDateRange: Date, endDateRange: Date) {
    const startCondition = {};
    startCondition[ReceiptsColNames.emissionDate] = { $gte: startDateRange };
    const stopCondition = {};
    stopCondition[ReceiptsColNames.emissionDate] = { $lt: endDateRange };
    return {
      $match: {
        $and: [startCondition, stopCondition],
      },
    };
  }

  private dateToString(dateFieldName: string) {
    return { $dateToString: { format: '%d-%m-%Y', date: '$' + dateFieldName } };
  }

  private errHandling(err: any) {
    console.log('the error', err);
    return new PdfCreationErrorObj(PdfMessages.err_pdf_fetching_data, err);
  }

  private getActualYearOrMonthStartEnd(getMonth: boolean) {
    const actual = new Date();
    return {
      start: getMonth ? new Date(actual.getFullYear(), 0, 1) : new Date(actual.getFullYear(), 0, 1),
      end: getMonth
        ? new Date(actual.getFullYear(), 11, 31)
        : new Date(actual.getFullYear(), 11, 31),
    };
  }
}