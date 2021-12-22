import { model, Schema, Model } from 'mongoose';
import { ITeacher } from './interfaces/Teacher';
import { IMongoUser, IUser } from './interfaces/User';

export const TeacherModel: Model<ITeacher> = model(
  'Teacher',
  new Schema({
    idName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    fiscalCode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    CAP: {
      type: Number,
      required: true,
    },
    IVA: {
      type: String,
      required: true,
    },
  })
);

export function TeacherModelBuilder(t: ITeacher) {
  return TeacherModel.create(t);
}
