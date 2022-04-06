import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, first, map, mapTo, Observable, of, Subject, tap } from 'rxjs';
import { IPdfRequest } from 'src/app/main-page/analytics/IPdfRequest';
import { IHttpPdfParams } from 'src/app/main-page/student/printout/IHttpPdfParams';
import { devErrorHandlingPdf } from 'src/app/shared/devErrorHandler';
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

  getBlankReceipt(studentId: string) {
    return this.handleBlobResponse(
      this.http.get<Blob>(this.dbUrl + 'blank/' + studentId, {
        params: this.getParams({ locale: this.translateS.currentLang }),
        observe: 'response',
        responseType: 'blob' as 'json',
      })
    );
  }

  getStudentRecsPdf(body: IStudentPdfReqBody) {
    return this.handlePdfPostReq(this.dbUrl + 'printout/studentRecap', body);
  }

  getAllRecs(body: IPdfRequest) {
    return this.handlePdfPostReq(this.dbUrl + 'analytics/printout', body);
  }

  private handlePdfPostReq(url: string, body: IPdfReqBody) {
    return this.handleBlobResponse(
      this.http.post<Blob>(url, this.addClientInfoToBody(body), {
        observe: 'response',
        responseType: 'blob' as 'json',
      })
    );
  }

  private handleBlobResponse(response: Observable<HttpResponse<Blob>>) {
    return response.pipe(
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

  private addClientInfoToBody(body: IPdfReqBody): IPdfReqBody {
    const output: IPdfReqBody = {
      ...body,
      locale: this.translateS.currentLang,
    };
    return output;
  }

  private get currentTimezone() {
    return new Date().getTimezoneOffset();
  }
}

type IPdfReqBody = IStudentPdfReqBody | IPdfRequest;
