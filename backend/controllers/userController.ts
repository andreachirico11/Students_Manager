import { hash, compare } from 'bcrypt';
import { NextFunction, Response } from 'express';
import { HttpResponse } from '../models/interfaces/responses/HttpResponse';
import { IUserRequest } from '../models/interfaces/requests/IUserRequest';
import { IMongoUser, IUser } from '../models/interfaces/User';
import { UserModel, UserModelBuilder } from '../models/userModel';
import { generateToken } from './webTokenController';
import { fail } from '../utils/httpFailFunction';

export function postUser(req: IUserRequest, res: Response, nex: NextFunction) {
  const newUser: IUser = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name || '',
  };
  if (!newUser.email || !newUser.password || !newUser.name) {
    return fail(res, 500, 'signup_failed');
  }
  hash(newUser.password, 10).then((hashedPassword) => {
    newUser.password = hashedPassword;
    UserModelBuilder(newUser)
      .then((u) => {
        u.save()
          .then((created) => {
            res.status(201).json(new HttpResponse('user_registred', generateToken(created)));
          })
          .catch((e) => fail(res, 500, 'save_error'));
      })
      .catch((e) => fail(res, 500, 'hashing_fail'));
  });
}

export function getUser(req: IUserRequest, res: Response, nex: NextFunction) {
  let foundUser: IMongoUser;
  const { email, password } = req.body;
  if (!password || !email) {
    return fail(res, 404, 'no_credentials');
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
        return fail(res, 401, 'wrong_password');
      }
      res.status(200).json(new HttpResponse('user_found', generateToken(foundUser)));
    })
    .catch((e) => fail(res, 404, 'user_not_found'));
}
