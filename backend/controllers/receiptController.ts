import { Request, Response } from 'express';
import { IBackendRequest } from '../models/interfaces/IRequests';
import { HttpResponse } from '../models/interfaces/UserResponse';
import { IReceipt } from '../models/interfaces/Receipt';
import { ReceiptModel, ReceiptModelBuilder } from '../models/receiptModel';
import { StudentModel } from '../models/studentModell';
import { fail } from '../utils/httpFailFunction';

export function postReceipt(req: IBackendRequest<IReceipt>, res: Response) {
  ReceiptModelBuilder(req.body)
    .then((receipt) => {
      if (receipt) {
        return StudentModel.updateOne(
          { _id: req.params.studentId },
          { $push: { receiptIds: receipt._id } }
        );
      }
      throw new Error();
    })
    .then((s) => res.status(200).json(new HttpResponse('student_updated_with_receipt', s)))
    .catch(() => fail(res, 500, 'receipt_creation_fail'));
}

export function putReceipt(req: IBackendRequest<IReceipt>, res: Response) {
  ReceiptModel.findById({ _id: req.params.receiptId })
    .then((r) => {
      if (r) {
        r.number = req.body.number;
        r.amount = req.body.amount;
        r.emissionDate = req.body.emissionDate;
        r.paymentDate = req.body.paymentDate;
        r.typeOfPayment = req.body.typeOfPayment;
        return r.save();
      }
      throw new Error();
    })
    .then((r) => res.status(200).json(new HttpResponse('receipt_updated', r)))
    .catch(() => fail(res, 500, 'update_fail'));
}

export function deleteReceipt(req: Request, res: Response) {
  const recId = req.params.id;
  StudentModel.findOne({ receiptIds: recId })
    .then((s) => {
      if (s && s.receiptIds) {
        return s.updateOne({ $pull: { receiptIds: recId } });
      }
      return;
    })
    .then((s) => {
      return ReceiptModel.deleteOne({ _id: recId });
    })
    .then((r) => {
      if (r.deletedCount && r.deletedCount > 0) {
        return res.status(200).json(new HttpResponse('receipt_deleted'));
      }
      throw new Error();
    })
    .catch(() => fail(res, 500, 'delete_fail'));
}
