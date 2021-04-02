import { model, Model, Schema } from 'mongoose';
import { IMongoParent, IParent } from './interfaces/Parent';

export const ParentModel: Model<IMongoParent> = model(
  'Parent',
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
    fiscalCode: {
      type: String,
      required: true,
    },
  })
);

export function ParentModelBuilder(Parent: IParent) {
  return ParentModel.create(Parent);
}
