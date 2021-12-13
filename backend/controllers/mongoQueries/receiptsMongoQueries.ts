import { IPdfReceipt } from '../../models/interfaces/IPdfReceipt';
import { IStudentPdfReqBody } from '../../models/interfaces/IStudentPdfReqBody';
import { PdfMessages } from '../../models/messageEnums';
import { PdfCreationErrorObj } from '../../models/pdfCreationError';
import { ReceiptModel } from '../../models/receiptModel';

export class ReceiptsMongoQueries {
  get allReceipts(): Promise<IPdfReceipt[]> {
    return ReceiptModel.aggregate([
      this.lookupForStudetInfo(),
      {
        $unwind: '$studentInfo',
      },
      {
        $addFields: {
          studentName: this.concatStudentName('studentInfo'),
          paymentDateString: this.dateToString('paymentDate'),
          emissionDateString: this.dateToString('emissionDate'),
        },
      },
    ]).catch((e) => {
      throw this.errHandling(e);
    });
  }

  recsForStudentWithColFilter(params: IStudentPdfReqBody): Promise<IPdfReceipt[]> {
    return ReceiptModel.aggregate([
      this.matchByStudentId(params._studentId),
      this.projectDesiredColumns(params.columns),
      {
        $addFields: {
          paymentDateString: this.dateToString('paymentDate'),
          emissionDateString: this.dateToString('emissionDate'),
        },
      },
    ]).catch((e) => {
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

  private dateToString(dateFieldName: string) {
    return { $dateToString: { format: '%d-%m-%Y', date: '$' + dateFieldName } };
  }

  private showOrNot(columns: string[], colName: string): number {
    return columns.find((c) => c === colName) ? 1 : 0;
  }

  private errHandling(err: any) {
    return new PdfCreationErrorObj(PdfMessages.err_pdf_fetching_data, err);
  }
}
