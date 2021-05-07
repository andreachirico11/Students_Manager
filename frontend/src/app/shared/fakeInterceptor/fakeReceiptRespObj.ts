import { IHttpResponse } from '../models/IHttpResponse';
import { ReceiptMessages } from '../models/MessageEnums';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';

export class ReceiptFakeResponses {
  constructor(private FAKE_DB: Student[]) {}

  postReceipt(): IHttpResponse<Receipt> {
    const payload = this.getReceipt();
    return {
      message: ReceiptMessages.receipt_created,
      payload,
    };
  }

  putReceipt(): IHttpResponse<Receipt> {
    const payload = this.getReceipt();
    return {
      message: ReceiptMessages.receipt_updated,
      payload,
    };
  }

  deleteReceipt(id: string): IHttpResponse<null> {
    const studentRef = this.findStudent(id);
    studentRef.receipts = studentRef.receipts.filter((r) => r.id !== id);
    return {
      message: ReceiptMessages.receipt_deleted,
      payload: null,
    };
  }

  private getReceipt(): Receipt {
    const studentWithR = this.FAKE_DB.find((s) => s.receipts.length > 0);
    return studentWithR.receipts[Math.floor(Math.random() * (studentWithR.receipts.length - 1))];
  }

  private findStudent(receiptId: string): Student {
    const studentRef = this.FAKE_DB.find((s) => s.receipts.some((r) => r.id === receiptId));
    return studentRef.receipts.length > 0 ? studentRef : this.findStudent(receiptId);
  }
}
