import { Response } from 'express';
import { IBackendRequest, IRequest } from '../models/interfaces/IRequests';
import { IReceipt } from '../models/interfaces/Receipt';
import { ReceiptModel, ReceiptModelBuilder } from '../models/receiptModel';
import { StudentModel } from '../models/studentModell';
import { generateHttpRes } from '../utils/httpRespGenerator';

export function postReceipt(req: IBackendRequest<IReceipt>, res: Response) {
  let receiptToSend: IReceipt;
  ReceiptModelBuilder(req.body)
    .then((receipt) => {
      if (receipt) {
        receiptToSend = receipt;
        return StudentModel.updateOne(
          { _id: req.params.studentId },
          { $push: { receiptIds: receipt._id } }
        );
      }
      throw new Error();
    })
    .then(() => generateHttpRes(res, 200, 'student_updated_with_receipt', receiptToSend))
    .catch(() => generateHttpRes(res, 500, 'receipt_creation_fail'));
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
    .then((r) => generateHttpRes(res, 200, 'receipt_updated', r))
    .catch(() => generateHttpRes(res, 500, 'update_fail'));
}

export function deleteReceipt(req: IRequest, res: Response) {
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
        return generateHttpRes(res, 200, 'receipt_deleted');
      }
      throw new Error();
    })
    .catch(() => generateHttpRes(res, 500, 'delete_fail'));
}
