import { NextFunction } from 'express';
import { UserModelBuilder } from '../models/userModel';
import { Request, Response } from 'express';
import { HttpResponse } from '../models/interfaces/HttpResponse';

export function postUser(req: Request, res: Response, nex: NextFunction) {
  const newUser = UserModelBuilder({
    email: 'abc@gmail',
    password: '12345',
    name: 'gianni',
  });
  newUser
    .save()
    .then((result) => {
      res.status(201).json(new HttpResponse('user registred', '', result));
    })
    .catch(console.error);
}
