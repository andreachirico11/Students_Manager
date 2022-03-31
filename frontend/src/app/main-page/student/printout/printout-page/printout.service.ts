import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, first, map, mapTo, Observable, of, Subject, tap } from 'rxjs';
import { IPdfRequest } from 'src/app/main-page/analytics/IPdfRequest';
import { IHttpPdfParams } from 'src/app/main-page/student/printout/IHttpPdfParams';
import { devErrorHandling, devErrorHandlingPdf } from 'src/app/shared/devErrorHandler';
import { environment } from 'src/environments/environment';
import { IStudentPdfReqBody } from '../IStudentPdfReqBody';

@Injectable({
  providedIn: 'root',
})
export class PrintoutService {
  private dbUrl = environment.dbUrl;
  private _fileReady = new Subject<{ title: string; file: Blob }>();

  get fileReady() {
    return this._fileReady.asObservable();
  }

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

  getBlankReceipt(studentId: string) {
    return this.http
      .get<Blob>(this.dbUrl + 'blank/' + studentId, {
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

  getStudentRecsPdf(body: IStudentPdfReqBody) {
    return this.http
      .post<Blob>(this.dbUrl + 'printout/studentRecap', body, {
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
          devErrorHandlingPdf(e);
          return of(null);
        })
      );
  }

  getAllRecs(body: IPdfRequest) {
    return this.http
      .post<Blob>(this.dbUrl + 'analytics/printout', body, {
        observe: 'response',
        responseType: 'blob' as 'json',
      })
      .pipe(
        first(),
        tap((res) =>
          this._fileReady.next({
            file: res.body,
            title: res.headers.get('file-name') ?? 'default title',
          })
        ),
        mapTo(true),
        catchError((e) => {
          devErrorHandlingPdf(e);
          return of(false);
        })
      );
  }

  private getParams(pars: IHttpPdfParams): HttpParams {
    return Object.keys(pars).reduce((acc, key) => acc.append(key, pars[key]), new HttpParams());
  }
}
