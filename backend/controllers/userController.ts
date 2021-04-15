import { compare, hash } from 'bcrypt';
import { Response } from 'express';
import { IBackendRequest } from '../models/interfaces/IRequests';
import { IMongoUser, IUser } from '../models/interfaces/User';
import { UserModel, UserModelBuilder } from '../models/userModel';
import { generateHttpRes } from '../utils/httpRespGenerator';
import { generateToken } from './webTokenController';

export function postUser(req: IBackendRequest<IUser>, res: Response) {
  const newUser: IUser = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name || '',
  };
  if (!newUser.email || !newUser.password || !newUser.name) {
    return generateHttpRes(res, 500, 'signup_failed');
  }
  hash(newUser.password, 10).then((hashedPassword) => {
    newUser.password = hashedPassword;
    UserModelBuilder(newUser)
      .then((u) => {
        u.save()
          .then((created) => {
            return generateHttpRes(res, 200, 'user_registered', generateToken(created));
          })
          .catch((e) => generateHttpRes(res, 500, 'save_error'));
      })
      .catch((e) => generateHttpRes(res, 500, 'hashing_fail'));
  });
}

export function getUser(req: IBackendRequest<IUser>, res: Response) {
  let foundUser: IMongoUser;
  const { email, password } = req.body;
  if (!password || !email) {
    return generateHttpRes(res, 404, 'no_credentials');
  }
  UserModel.findOne({ email: req.body.email })
    .then((found) => {
      if (found) {
        foundUser = found;
        return compare(req.body.password, found.password);
      }
      throw new Error('not_found_in_db');
    })
    .then((result) => {
      if (!result) {
        return generateHttpRes(res, 401, 'wrong_password');
      }
      return generateHttpRes(res, 200, 'user_found', generateToken(foundUser));
    })
    .catch((e) => generateHttpRes(res, 404, 'user_not_found'));
}
