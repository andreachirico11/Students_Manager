import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Receipt } from '../models/Receipts';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dbUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  public getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.dbUrl + 'students');
  }

  public getReceiptsForStudent(receiptId: string): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.dbUrl + 'receipts' + receiptId);
  }
}
