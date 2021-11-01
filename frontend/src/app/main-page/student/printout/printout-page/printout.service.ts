import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, first, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrintoutService {
  private dbUrl = environment.dbUrl;

  constructor(private http: HttpClient) {}

  getPdf() {
    return this.http
      .get<Blob>(this.dbUrl + 'printout', { observe: 'body', responseType: 'blob' as 'json' })
      .pipe(
        first(),
        tap((file) => {
          // verify pdf validity
        }),
        catchError((e) => {
          console.log('printout service: ', e);
          throw e;
        })
      );
  }
}
