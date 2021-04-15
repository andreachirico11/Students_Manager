import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  public addStudent(): Observable<Student> {
    return of();
  }

  public updateStudentNote(id: string, newNote: string): Observable<boolean> {
    return of();
  }

  public updateStudent(updated: Student): Observable<boolean> {
    return of();
  }

  public deleteStudent(id: string): Observable<boolean> {
    return of();
  }
}
