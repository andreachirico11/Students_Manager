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
    shoolClass: {
      type: String,
    },
    fiscalCode: {
      type: String,
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
        ref: 'Comment',
      },
    ],
    parentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Parent',
      },
    ],
  })
);

export function StudentModelBuilder(Student: IStudent) {
  return StudentModel.create(Student);
}
