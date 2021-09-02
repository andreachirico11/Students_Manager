export interface IHttpResponse<T> {
  message: string;
  payload?: T;
  isOffline?: boolean;
}
