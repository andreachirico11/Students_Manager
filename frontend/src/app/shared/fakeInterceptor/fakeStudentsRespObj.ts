import { IHttpResponse } from '../models/IHttpResponse';
import { StudentMessages } from '../models/MessageEnums';
import { Student } from '../models/Student';

export class StudentFakeResponses {
  constructor(private FAKE_DB: Student[]) {}

  getAllStudents(): IHttpResponse<Student[]> {
    return {
      message: StudentMessages.student_found,
      payload: this.FAKE_DB,
    };
  }

  getStudent(id: string): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_found,
      payload: this.FAKE_DB.find((s) => s.id === id),
    };
  }

  postStudent(stToAdd: Student): IHttpResponse<Student> {
    const studentToAdd: Student = { ...stToAdd, id: this.generateLastId() };
    this.FAKE_DB.push(studentToAdd);
    return {
      message: StudentMessages.student_created,
      payload: studentToAdd,
    };
  }

  putStudent(stUpdated: Student): IHttpResponse<Student> {
    const i = this.FAKE_DB.findIndex((s) => s.id === stUpdated.id);
    this.FAKE_DB[i] = { ...stUpdated };
    return {
      message: StudentMessages.student_updated,
      payload: this.FAKE_DB[i],
    };
  }

  deleteStudent(id: string): IHttpResponse<null> {
    this.FAKE_DB = [...this.FAKE_DB.filter((s) => s.id !== id)];
    return {
      message: StudentMessages.student_deleted,
      payload: null,
    };
  }

  private generateLastId() {
    const lastNum = +this.FAKE_DB[this.FAKE_DB.length - 1].id.split('_')[1];
    return 's_' + (lastNum + 1);
  }
}
