import { compare, hash } from 'bcrypt';
import { Response } from 'express';
import { ServerMessages, UserMessages } from '../models/messageEnums';
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
    return generateHttpRes(res, 500, ServerMessages.creation_error);
  }
  hash(newUser.password, 10).then((hashedPassword) => {
    newUser.password = hashedPassword;
    UserModelBuilder(newUser)
      .then((u) => {
        u.save()
          .then((created) => {
            return generateHttpRes(res, 200, UserMessages.user_registered, generateToken(created));
          })
          .catch((e) => generateHttpRes(res, 500, ServerMessages.creation_error));
      })
      .catch((e) => generateHttpRes(res, 500, ServerMessages.creation_error));
  });
}

export function getUser(req: IBackendRequest<IUser>, res: Response) {
  let foundUser: IMongoUser;
  const { email, password } = req.body;
  if (!password || !email) {
    return generateHttpRes(res, 404, UserMessages.wrong_credentials);
  }
  UserModel.findOne({ email: req.body.email })
    .then((found) => {
      if (found) {
        foundUser = found;
        return compare(req.body.password, found.password);
      }
      throw new Error(UserMessages.user_not_found);
    })
    .then((result) => {
      if (!result) {
        return generateHttpRes(res, 401, UserMessages.wrong_credentials);
      }
      return generateHttpRes(res, 200, UserMessages.user_found, generateToken(foundUser));
    })
    .catch((e) => generateHttpRes(res, 404, UserMessages.user_not_found));
}
