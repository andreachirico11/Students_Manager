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

  getStudent(): IHttpResponse<Student> {
    return {
      message: StudentMessages.student_found,
      payload: FAKE_DB.students[1],
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

  deleteStudent(): IHttpResponse<null> {
    return {
      message: StudentMessages.student_deleted,
      payload: null,
    };
  },
};
