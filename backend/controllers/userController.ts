import { compare, hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from '../models/interfaces/HttpResponse';
import { IUserRequest } from '../models/interfaces/IUserRequest';
import { IMongoUser, IUser } from '../models/interfaces/User';
import { UserModel, UserModelBuilder } from '../models/userModel';

export function postUser(req: IUserRequest, res: Response, nex: NextFunction) {
  const newUser: IUser = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name || '',
  };
  if (!newUser.email || !newUser.password || !newUser.name) {
    res.status(500).json(new HttpResponse('signup_failed'));
  }
  hash(newUser.password, 10).then((hashedPassword) => {
    newUser.password = hashedPassword;
    UserModelBuilder(newUser)
      .then((u) => {
        u.save()
          .then((result) => {
            res.status(201).json(new HttpResponse('user_registred', result));
          })
          .catch(console.error);
      })
      .catch(console.error);
  });
}

export function getUser(req: IUserRequest, res: Response, nex: NextFunction) {
  let foundUser: IMongoUser;
  const fail = (title: string, err?: any) => res.status(404).json(new HttpResponse(title, err));
  const { email, password } = req.body;
  if (!password || !email) {
    return fail('no_credentials');
  }
  UserModel.findOne({ email: req.body.email })
    .then((found) => {
      if (found) {
        foundUser = found;
        return compare(found.password, req.body.password);
      }
      fail('user_not_found');
    })
    .then((result) => {
      // sempre false
      //   res.status(200).json(new HttpResponse('user_found', found));
    })
    .catch(fail);
}
