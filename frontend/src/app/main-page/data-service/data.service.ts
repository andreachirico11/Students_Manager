import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/shared/models/IHttpResponse';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dbUrl = environment.dbUrl;
  private _reload = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  public get reload() {
    return this._reload.asObservable();
  }

  private launchReload() {
    this._reload.next(true);
  }

  public getStudents(): Observable<Student[]> {
    return this.http.get<IHttpResponse<Student[]>>(this.dbUrl + 'students').pipe(
      map((r) => r.payload),
      catchError((e) => of([]))
    );
  }

  public getStudentWithReceipts(id: string): Observable<Student> {
    return this.http.get<IHttpResponse<Student>>(this.dbUrl + `students/${id}`).pipe(
      map((r) => r.payload),
      catchError((e) => of(null))
    );
  }

  public addStudent(newStudent: Student): Observable<Student> {
    return this.http.post<IHttpResponse<Student>>(this.dbUrl + 'students', newStudent).pipe(
      map((r) => r.payload),
      catchError((e) => of(null))
    );
  }

  public updateStudent(updated: Student): Observable<Student> {
    return this.http
      .put<IHttpResponse<Student>>(this.dbUrl + `students/${updated.id}`, updated)
      .pipe(
        map((r) => r.payload),
        catchError((e) => of(null))
      );
  }

  public deleteStudent(id: string): Observable<boolean> {
    return this.http
      .delete<HttpResponse<IHttpResponse<null>>>(this.dbUrl + `students/${id}`, {
        observe: 'response',
      })
      .pipe(
        tap((r) => {
          if (r.status === 200) {
            this.launchReload();
          }
        }),
        map((r) => (r.status === 200 ? true : throwError(''))),
        catchError((e) => of(null))
      );
  }

  public addReceipt(studentId: string, r: Receipt): Observable<boolean> {
    return this.sharedPipe(
      this.http.post<IHttpResponse<Receipt>>(this.dbUrl + 'receipts/' + studentId, r)
    );
  }

  public updateReceipt(updated: Receipt): Observable<boolean> {
    return this.sharedPipe(
      this.http.put<IHttpResponse<Receipt>>(this.dbUrl + `receipts/${updated.id}`, updated)
    );
  }

  public deleteReceipt(id: string): Observable<boolean> {
    return this.sharedPipe(this.http.delete<IHttpResponse<null>>(this.dbUrl + `receipts/${id}`));
    // return this.http
    //   .delete<IHttpResponse<null>>(this.dbUrl + `receipts/${id}`, {
    //     observe: 'response',
    //   })
    //   .pipe(
    //     map((r) => (r.status === 200 ? true : throwError(''))),
    //     catchError((e) => of(null))
    //   );
  }

  private sharedPipe(obs: Observable<any>): Observable<boolean> {
    return obs.pipe(
      tap(console.log),
      map(() => true),
      catchError(() => of(false))
    );
  }
}
