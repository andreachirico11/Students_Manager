import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, delay, first, map, mapTo, switchMapTo, tap } from 'rxjs/operators';
import { devErrorHandling } from 'src/app/shared/devErrorHandler';
import { generateHttpParams } from 'src/app/shared/httpParamsGenerator';
import { IHttpResponse } from 'src/app/shared/models/IHttpResponse';
import { IStats } from 'src/app/shared/models/IStats';
import { Parent } from 'src/app/shared/models/Parent';
import { ReceiptPrice } from 'src/app/shared/models/ReceiptPrice';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';
import { TimezoneHelperService } from 'src/app/shared/timezone-helper/timezone-helper.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dbUrl = environment.dbUrl;
  private localStudentDb: Student[] = [];
  private localStats: IStats = null;
  private studentsSubj = new BehaviorSubject<Student[]>(null);
  private statsSubj = new BehaviorSubject<IStats>(null);

  constructor(
    private http: HttpClient,
    private swUpdate: SwUpdate,
    private timezoneHelper: TimezoneHelperService
  ) {}

  public get studentDbObservable(): Observable<Student[]> {
    return this.studentsSubj.asObservable();
  }

  public get statsbObservable(): Observable<IStats> {
    return this.statsSubj.asObservable();
  }

  public getStudents(): Observable<boolean> {
    return this.http.get<IHttpResponse<Student[]>>(this.dbUrl + 'students').pipe(
      first(),
      tap((res) => {
        this.localStudentDb = [...res.payload];
        this.studentsSubj.next(this.localStudentDb);
        this.getAllDataIfPwa(res.payload);
      }),
      mapTo(true),
      catchError((e) => {
        devErrorHandling(e);
        return of(false);
      })
    );
  }

  public getStudentWithReceipts(id: string): Observable<Student> {
    return this.http.get<IHttpResponse<Student>>(this.dbUrl + `students/${id}`).pipe(
      map((r) => {
        if (r.payload) {
          return new Student(
            r.payload.name,
            r.payload.surname,
            new Parent(
              r.payload.parent.name,
              r.payload.parent.surname,
              r.payload.parent.phoneNumber,
              r.payload.parent.fiscalCode,
              r.payload.parent.address
            ),
            r.payload.receipts,
            r.payload.isWithRec,
            r.payload.dateOfBirth,
            r.payload.phoneNumber,
            r.payload.fiscalCode,
            r.payload.schoolClass,
            r.payload.address,
            r.payload.notes,
            r.payload.receiptPrice
              ? new ReceiptPrice(
                  r.payload.receiptPrice.total,
                  r.payload.receiptPrice.tax,
                  r.payload.receiptPrice.price
                )
              : null,
            r.payload.id
          );
        }
        throwError(new Error(''));
      }),
      catchError((e) => {
        devErrorHandling(e);
        return of(null);
      })
    );
  }

  public addStudent(newStudent: Student): Observable<boolean | string> {
    return this.http.post<IHttpResponse<Student>>(this.dbUrl + 'students', newStudent).pipe(
      tap((res) => {
        if (!res.isOffline) {
          this.localStudentDb.push(res.payload);
          this.studentsSubj.next(this.localStudentDb);
        }
      }),
      map((res) => (res.isOffline ? res.message : true)),
      catchError((e) => {
        devErrorHandling(e);
        return of(false);
      })
    );
  }

  public updateStudent(updated: Student): Observable<boolean | string> {
    return this.http.put<IHttpResponse<null>>(this.dbUrl + `students/${updated.id}`, updated).pipe(
      tap((res) => {
        if (!res.isOffline) {
          const index = this.localStudentDb.findIndex((s) => updated.id === s.id);
          this.localStudentDb = [
            ...this.localStudentDb.slice(0, index),
            updated,
            ...this.localStudentDb.slice(index + 1),
          ];
          this.studentsSubj.next(this.localStudentDb);
        }
      }),
      map((res) => (res.isOffline ? res.message : true)),
      catchError((e) => {
        devErrorHandling(e);

        return of(false);
      })
    );
  }

  public deleteStudent(id: string): Observable<boolean | string> {
    return this.http
      .delete<HttpResponse<IHttpResponse<null>>>(this.dbUrl + `students/${id}`, {
        observe: 'response',
      })
      .pipe(
        tap((r) => {
          if (r.status === 200 && !r.body['isOffline']) {
            this.removeAndUpdateStudents(id);
          }
        }),
        map((r) =>
          r.status !== 200 ? throwError('') : r.body['isOffline'] ? r.body['message'] : true
        ),
        switchMapTo(this.getStats()),
        catchError((e) => {
          devErrorHandling(e);
          return of(null);
        })
      );
  }

  public addReceipt(studentId: string, r: Receipt): Observable<boolean | string> {
    return this.sharedPipe(
      this.http.post<IHttpResponse<Receipt>>(this.dbUrl + 'receipts/' + studentId, r)
    );
  }

  public updateReceipt(updated: Receipt): Observable<boolean | string> {
    return this.sharedPipe(
      this.http.put<IHttpResponse<Receipt>>(this.dbUrl + `receipts/${updated.id}`, updated)
    );
  }

  public deleteReceipt(id: string): Observable<boolean | string> {
    return this.sharedPipe(this.http.delete<IHttpResponse<null>>(this.dbUrl + `receipts/${id}`));
  }

  public getStats(): Observable<boolean> {
    return this.http
      .get<IHttpResponse<IStats>>(this.dbUrl + 'stats', {
        params: generateHttpParams({ timezoneOffset: this.timezoneHelper.currentTimezone }),
      })
      .pipe(
        tap((res) => {
          this.localStats = res.payload;
          this.statsSubj.next(this.localStats);
        }),
        mapTo(true),
        catchError((e) => {
          devErrorHandling(e);
          return of(null);
        })
      );
  }

  private sharedPipe(obs: Observable<any>): Observable<boolean | string> {
    return obs.pipe(
      map((res) => (res.isOffline ? res.message : true)),
      switchMapTo(this.getStats()),
      mapTo(true),
      catchError((e) => {
        devErrorHandling(e);
        return of(false);
      })
    );
  }

  private removeAndUpdateStudents(stId: string) {
    this.localStudentDb = this.localStudentDb.filter((s) => s.id !== stId);
    this.studentsSubj.next(this.localStudentDb);
  }

  private getAllDataIfPwa(students: Student[]) {
    if (this.swUpdate && this.swUpdate.isEnabled) {
      forkJoin(students.map((s) => this.getStudentWithReceipts(s.id)))
        .pipe(delay(3000), first())
        .subscribe();
    }
  }
}
