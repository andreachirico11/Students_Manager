import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Receipt } from 'src/app/shared/models/Receipts';
import { Student } from 'src/app/shared/models/Student';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dbUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  public getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.dbUrl + 'students');
  }

  public getReceiptsForStudent(receiptIds: string[]): Observable<Receipt[]> {
    return this.http
      .get<Receipt[]>(this.dbUrl + 'receipts')
      .pipe(map((receipts) => receipts.filter((r) => !receiptIds.find((id) => id === r.id))));
  }
}
