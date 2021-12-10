import { IStudentPdfReqBody } from '../models/interfaces/IStudentPdfReqBody';
import { PdfMessages } from '../models/messageEnums';
import { PdfCreationErrorObj } from '../models/pdfCreationError';
import { ReceiptModel } from '../models/receiptModel';

export class ReceiptsMongoQueries {
  constructor(private studentRecapParams?: IStudentPdfReqBody) {}

  get allReceipts() {
    return ReceiptModel.aggregate([
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
    ]).catch((err) => {
      throw new PdfCreationErrorObj(PdfMessages.err_pdf_fetching_data, err);
    });
  }

  get allReceiptsForStudent() {
    return;
  }
}
