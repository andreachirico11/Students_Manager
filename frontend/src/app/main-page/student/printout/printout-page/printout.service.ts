import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrintoutService {
  private dbUrl = environment.dbUrl;

  constructor(private http: HttpClient) {}

  getPdf() {
    return this.http.get(this.dbUrl + 'printout').pipe(tap(console.log));
  }
}
