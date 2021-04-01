import { model, Schema, Model } from 'mongoose';
import { IMongoUser, IUser } from './interfaces/User';

export const UserModel: Model<IMongoUser> = model(
  'User',
  new Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  })
);

export function UserModelBuilder(user: IUser) {
  return UserModel.create(user);
}
