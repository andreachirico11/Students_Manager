import { IHttpResponse } from '../models/IHttpResponse';
import { ReceiptMessages } from '../models/MessageEnums';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';

export class ReceiptFakeResponses {
  constructor(private FAKE_DB: Student[]) {}

  postReceipt(studentId: string, rToAdd: Receipt): IHttpResponse<Receipt> {
    const owner = this.findStudentByid(studentId);
    const newR = { ...rToAdd, id: this.generateLastId(owner) };
    owner.receipts.push(newR);
    return {
      message: ReceiptMessages.receipt_created,
      payload: newR,
    };
  }

  // putReceipt(updatedR: Receipt): IHttpResponse<Receipt> {
  //   let found = this.findReceiptInWholeDb(updatedR.id);
  //   found = { ...updatedR };
  //   return {
  //     message: ReceiptMessages.receipt_updated,
  //     payload: found,
  //   };
  // }

  putReceipt(updatedR: Receipt): IHttpResponse<Receipt> {
    const { rIndex, sttIndex } = this.findIndexesInWholeDb(updatedR.id);
    this.FAKE_DB[sttIndex].receipts[rIndex] = { ...updatedR };
    return {
      message: ReceiptMessages.receipt_updated,
      payload: updatedR,
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

  private generateLastId(student: Student) {
    const rLength = student.receipts.length;
    if (rLength === 0) return 'r_0';
    const lastNum = +student.receipts[rLength - 1].id.split('_')[1];
    return 'r_' + (lastNum + 1);
  }

  private findStudentByid(id: string) {
    return this.FAKE_DB.find((s) => s.id === id);
  }

  private findReceiptInWholeDb(rId: string) {
    let foundR: Receipt;
    for (const student of this.FAKE_DB) {
      foundR = student.receipts.find((r) => r.id === rId);
      if (foundR) {
        break;
      }
    }
    return foundR;
  }

  private findIndexesInWholeDb(rId: string) {
    for (let i = 0; i < this.FAKE_DB.length; i++) {
      const rIndex = this.FAKE_DB[i].receipts.findIndex((r) => r.id === rId);
      if (rIndex > -1) {
        return {
          rIndex,
          sttIndex: i,
        };
      }
    }
  }

  private findStudent(receiptId: string): Student {
    const studentRef = this.FAKE_DB.find((s) => s.receipts.some((r) => r.id === receiptId));
    return studentRef.receipts.length > 0 ? studentRef : this.findStudent(receiptId);
  }
}
