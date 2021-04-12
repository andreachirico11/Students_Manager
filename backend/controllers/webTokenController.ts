import { NextFunction, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { IRequest } from '../models/interfaces/IRequests';
import { IFrontendUser, IMongoUser } from '../models/interfaces/User';
import { IUserResponse } from '../models/interfaces/UserResponse';
import { generateHttpRes } from '../utils/httpFailFunction';

const longString = process.env.SECRET_AUTH_STRING || 'SECRET_AUTH_STRING';

export function generateToken(user: IMongoUser): IUserResponse {
  const userToAttach: IFrontendUser = {
    email: user.email,
    id: user._id,
    name: user.name,
    password: user.password,
  };
  return {
    token: sign(userToAttach, longString, { expiresIn: '1h' }),
    expiresIn: 3600,
    loggedUserId: user._id,
  };
}

export function verifyToken(req: IRequest, res: Response, next: NextFunction) {
  let errorMsg = 'invalid_token';
  try {
    const token = req.headers['auth-token'];
    if (!token) {
      errorMsg = 'Token_not_found';
      throw new Error();
    }
    const verifiedToken = verify(token, longString);
    // in futuro si puo usare per attaccare user alla req
    next();
  } catch (e) {
    console.log(e);
    generateHttpRes(res, 401, errorMsg);
  }
}
