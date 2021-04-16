import { Response } from 'express';
import { IBackendRequest, IRequest } from '../models/interfaces/IRequests';
import { IReceipt } from '../models/interfaces/Receipt';
import { ReceiptMessages, ServerMessages } from '../models/messageEnums';
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
    .then(() => generateHttpRes(res, 200, ReceiptMessages.receipt_created, receiptToSend))
    .catch(() => generateHttpRes(res, 500, ServerMessages.creation_error));
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
    .then((r) => generateHttpRes(res, 200, ReceiptMessages.receipt_updated, r))
    .catch(() => generateHttpRes(res, 500, ServerMessages.update_error));
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
        return generateHttpRes(res, 200, ReceiptMessages.receipt_deleted);
      }
      throw new Error();
    })
    .catch(() => generateHttpRes(res, 500, ServerMessages.delete_error));
}
