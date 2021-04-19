import { IHttpResponse } from '../models/IHttpResponse';
import { StudentMessages } from '../models/MessageEnums';
import { Student } from '../models/Student';
import { FAKE_DB } from './fakeDb';

export const studentFakeResponses = {
  getAllStudents(): IHttpResponse<Student[]> {
    return {
      message: StudentMessages.student_found,
      payload: FAKE_DB.students,
    };
  },

  getStudent(id: string): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_found,
      payload: FAKE_DB.students.find((s) => s.id === id),
    };
  },

  postStudent(): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_created,
      payload: FAKE_DB.students[0],
    };
  },

  putStudent(): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_updated,
      payload: FAKE_DB.students[0],
    };
  },

  deleteStudent(id: string): IHttpResponse<null> {
    FAKE_DB.students = [...FAKE_DB.students.filter((s) => s.id !== id)];
    return {
      message: StudentMessages.student_deleted,
      payload: null,
    };
  },
};
