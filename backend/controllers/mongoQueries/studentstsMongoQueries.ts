import { IMongoStudent } from '../../models/interfaces/Student';
import { StudentMessages } from '../../models/messageEnums';
import { StudentModel } from '../../models/studentModell';

export class StudentMongoQueries {
  studentById(id: string): Promise<IMongoStudent | null> {
    return StudentModel.findById({ _id: id }).catch((e) => {
      throw new Error(StudentMessages.student_not_found);
    });
  }
}
