import { HttpParams } from '@angular/common/http';

export function generateHttpParams(pars: Object): HttpParams {
  return Object.keys(pars).reduce((acc, key) => acc.append(key, pars[key]), new HttpParams());
}
