import { ITeacher } from '../../models/interfaces/Teacher';
import { TeacherMessages } from '../../models/messageEnums';
import { TeacherModel } from '../../models/teacherModel';

export class TeacherMongoQueries {
  teacherByIdName(idName: string): Promise<ITeacher | null> {
    return TeacherModel.find({ idName: idName })
      .then((ts) => ts[0])
      .catch((e) => {
        throw new Error(TeacherMessages.teacher_not_found);
      });
  }
}
