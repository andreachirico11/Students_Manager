import { IHttpResponse } from '../models/IHttpResponse';
import { StudentMessages } from '../models/MessageEnums';
import { Student } from '../models/Student';

export class StudentFakeResponses {
  constructor(private fakeStudentDb: Student[]) {}

  getAllStudents(): IHttpResponse<Student[]> {
    return {
      message: StudentMessages.student_found,
      payload: this.fakeStudentDb,
    };
  }

  getStudent(id: string): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_found,
      payload: this.fakeStudentDb.find((s) => s.id === id),
    };
  }

  postStudent(stToAdd: Student): IHttpResponse<Student> {
    this.fakeStudentDb.push({ ...stToAdd, id: this.generateLastId() });
    return {
      message: StudentMessages.student_created,
      payload: this.fakeStudentDb[0],
    };
  }

  putStudent(stUpdated: Student): IHttpResponse<Student> {
    const i = this.fakeStudentDb.findIndex((s) => {
      s.id === stUpdated.id;
    });
    this.fakeStudentDb[i] = { ...stUpdated };
    return {
      message: StudentMessages.student_updated,
      payload: this.fakeStudentDb[0],
    };
  }

  deleteStudent(id: string): IHttpResponse<null> {
    this.fakeStudentDb = [...this.fakeStudentDb.filter((s) => s.id !== id)];
    return {
      message: StudentMessages.student_deleted,
      payload: null,
    };
  }

  private generateLastId() {
    const lastNum = +this.fakeStudentDb[this.fakeStudentDb.length - 1].id.split('_')[1];
    return 's_' + (lastNum + 1);
  }
}
