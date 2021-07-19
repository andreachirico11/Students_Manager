import { model, Model, Schema } from 'mongoose';
import { IMongoStudent, IStudent } from './interfaces/Student';

export const StudentModel: Model<IMongoStudent> = model(
  'Student',
  new Schema({
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    schoolClass: {
      type: String,
      required: true,
    },
    fiscalCode: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    notes: {
      type: String,
    },
    receiptIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Receipt',
      },
    ],
    parent: {
      name: { type: String, required: true },
      surname: { type: String, required: true },
      fiscalCode: { type: String },
      phoneNumber: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
      },
    },
  })
);

export function StudentModelBuilder(Student: IStudent, id?: string) {
  return StudentModel.create({ ...Student, id: id });
}
