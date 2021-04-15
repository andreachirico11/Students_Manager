import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    return this.http.get<Student>(this.dbUrl + `students/${id}`);
  }

  public addStudent(newStudent: Student): Observable<Student> {
    return this.http.post<Student>(this.dbUrl + 'students', newStudent);
  }

  public updateStudent(updated: Student): Observable<Student> {
    return this.http.put<Student>(this.dbUrl + `students/${updated.id}`, updated);
  }

  public deleteStudent(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.dbUrl + `students/${id}`);
  }

  public addReceipt(studentId: string, r: Receipt): Observable<Receipt> {
    return this.http.post<Receipt>(this.dbUrl + 'receipts/' + studentId, r);
  }

  public updateReceipt(updated: Receipt): Observable<Receipt> {
    return this.http.put<Receipt>(this.dbUrl + `receipts/${updated.id}`, updated);
  }

  public deleteReceipt(id: string): Observable<boolean> {
    return this.http.delete<boolean>(this.dbUrl + `receipts/${id}`);
  }
}
