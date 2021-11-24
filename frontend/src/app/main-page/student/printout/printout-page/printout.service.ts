import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrintoutService {
  private dbUrl = environment.dbUrl;

  constructor(private http: HttpClient) {}

  getPdf() {
    return this.http
      .get<{ file: Blob; title: string }>(this.dbUrl + 'printout', {
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
          console.log('printout service: ', e);
          throw e;
        })
      );
  }
}
