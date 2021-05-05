import { IHttpResponse } from '../models/IHttpResponse';
import { ReceiptMessages } from '../models/MessageEnums';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';
import { FAKE_DB } from './fakeDb';

export const receiptFakeResponses = {
  postReceipt(): IHttpResponse<Receipt> {
    const payload = getReceipt();
    return {
      message: ReceiptMessages.receipt_created,
      payload,
    };
  },

  putReceipt(): IHttpResponse<Receipt> {
    const payload = getReceipt();
    return {
      message: ReceiptMessages.receipt_updated,
      payload,
    };
  },

  deleteReceipt(id: string): IHttpResponse<null> {
    const studentRef = findStudent(id);
    studentRef.receipts = studentRef.receipts.filter((r) => r.id !== id);
    return {
      message: ReceiptMessages.receipt_deleted,
      payload: null,
    };
  },
};

function getReceipt(): Receipt {
  const studentWithR = FAKE_DB.students.find((s) => s.receipts.length > 0);
  return studentWithR.receipts[Math.floor(Math.random() * (studentWithR.receipts.length - 1))];
}

function findStudent(receiptId: string): Student {
  const studentRef = FAKE_DB.students.find((s) => s.receipts.some((r) => r.id === receiptId));
  return studentRef.receipts.length > 0 ? studentRef : findStudent(receiptId);
}
