import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dbUrl = environment.dbUrl;

  constructor(private http: HttpClient) {}

  public getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.dbUrl + 'students');
  }

  public getStudentWithReceipts(id: string): Observable<Student> {
    return of();
  }

  // public getReceiptsForStudent(receiptIds: string[]): Observable<Receipt[]> {
  //   return this.http
  //     .get<Receipt[]>(this.dbUrl + 'receipts')
  //     .pipe(map((receipts) => receipts.filter((r) => receiptIds.find((id) => id === r.id))));
  // }
}
