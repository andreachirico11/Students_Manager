import { sign } from 'jsonwebtoken';
import { IUserResponse } from '../models/interfaces/UserResponse';
import { IFrontendUser, IMongoUser } from '../models/interfaces/User';

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

export function verifyToken() {
  // TODO
}
