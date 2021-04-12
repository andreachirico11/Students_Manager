export class HttpResponse {
  constructor(public message: string, public payload?: any) {}
}

export interface IUserResponse {
  token: string;
  loggedUserId: string;
  expiresIn: number;
}
