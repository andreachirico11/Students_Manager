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
  })
);

export function ReceiptModelBuilder(Receipt: IReceipt) {
  return ReceiptModel.create(Receipt);
}
