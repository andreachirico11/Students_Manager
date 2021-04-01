import { model, Schema } from 'mongoose';
import { IUser } from './interfaces/User';

export const UserModel = model(
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
  return new UserModel(user);
}
