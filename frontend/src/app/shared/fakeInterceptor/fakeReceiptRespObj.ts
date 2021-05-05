import { IHttpResponse } from '../models/IHttpResponse';
import { ReceiptMessages, StudentMessages } from '../models/MessageEnums';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';
import { FAKE_DB } from './fakeDb';

export const receiptFakeResponses = {
  postReceipt(): IHttpResponse<Receipt> {
    return {
      message: ReceiptMessages.receipt_created,
      payload: FAKE_DB.students[2].receipts[0],
    };
  },

  putReceipt(): IHttpResponse<Receipt> {
    return {
      message: ReceiptMessages.receipt_updated,
      payload: FAKE_DB.students[2].receipts[0],
    };
  },

  deleteReceipt(id: string): IHttpResponse<null> {
    FAKE_DB.students[2].receipts = FAKE_DB.students[2].receipts.filter((r) => r.id !== id);
    return {
      message: ReceiptMessages.receipt_deleted,
      payload: null,
    };
  },
};
