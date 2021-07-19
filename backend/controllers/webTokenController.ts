import { NextFunction, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { IRequest } from '../models/interfaces/IRequests';
import { IFrontendUser, IMongoUser } from '../models/interfaces/User';
import { ILoginResponse } from '../models/interfaces/LoginrResponse';
import { generateHttpRes } from '../utils/httpRespGenerator';
import { TokenErrors } from '../models/messageEnums';

const longString = process.env.SECRET_AUTH_STRING ?? 'SECRET_AUTH_STRING';
const expirationTime = process.env.TOKEN_EXPIRATION_DATE ?? '1d';

export function generateToken(user: IMongoUser): ILoginResponse {
  const userToAttach: IFrontendUser = {
    email: user.email,
    id: user._id,
    name: user.name,
    password: user.password,
  };
  return {
    token: sign(userToAttach, longString, { expiresIn: expirationTime }),
    expiresIn: getExpirationMillis(expirationTime),
  };
}

export function verifyToken(req: IRequest, res: Response, next: NextFunction) {
  let errorMsg = TokenErrors.Invalid_token;
  try {
    const token = req.headers['auth-token'];
    if (!token) {
      errorMsg = TokenErrors.Token_not_found;
      throw new Error();
    }
    const verifiedToken = verify(token, longString);
    // in futuro si puo usare per attaccare user alla req
    next();
  } catch (e) {
    generateHttpRes(res, 401, errorMsg);
  }
}

function getExpirationMillis(expirationTime: string) {
  const howMany = Number(/[0-9]+/.exec(expirationTime) ?? 1);
  const measure = expirationTime.slice(-1);
  if (!howMany || typeof howMany === 'string') {
    return 86400000;
  }
  switch (measure) {
    case 'd':
    default:
      return 86400000 * howMany;
    case 'h':
      return 3600000 * howMany;
    case 'm':
      return 60000 * howMany;
    case 's':
      return 1000 * howMany;
  }
}
