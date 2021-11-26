import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, first, map, of, tap } from 'rxjs';
import { devErrorHandling } from 'src/app/shared/devErrorHandler';
import { IHttpPdfParams } from 'src/app/shared/models/IHttpPdfParams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrintoutService {
  private dbUrl = environment.dbUrl;

  constructor(private http: HttpClient, private translateS: TranslateService) {}

  getPdf() {
    return this.http
      .get<{ file: Blob; title: string }>(this.dbUrl + 'printout', {
        params: this.getParams({ locale: this.translateS.currentLang }),
        observe: 'response',
        responseType: 'blob' as 'json',
      })
      .pipe(
        first(),
        map((res) => ({
          file: res.body,
          title: res.headers.get('file-name') ?? 'default title',
        })),
        catchError((e) => {
          devErrorHandling(e);
          return of(null);
        })
      );
  }

  private getParams(pars: IHttpPdfParams): HttpParams {
    return Object.keys(pars).reduce((acc, key) => acc.append(key, pars[key]), new HttpParams());
  }
}
