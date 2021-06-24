import { model, Model, Schema } from 'mongoose';
import { IMongoReceipt, IReceipt } from './interfaces/Receipt';

export const ReceiptModel: Model<IMongoReceipt> = model(
  'Receipt',
  new Schema({
    number: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    emissionDate: {
      type: Date,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    typeOfPayment: {
      type: String,
      required: true,
    },
    _studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
  })
);

export function ReceiptModelBuilder(Receipt: IReceipt, studentId: string) {
  return ReceiptModel.create({ ...Receipt, _studentId: studentId });
}
