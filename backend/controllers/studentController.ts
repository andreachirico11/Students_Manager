import { Response } from 'express';
import { IBackendRequest, IRequest } from '../models/interfaces/IRequests';
import { IStudent } from '../models/interfaces/Student';
import { StudentModel, StudentModelBuilder } from '../models/studentModell';
import { generateHttpRes } from '../utils/httpRespGenerator';

export function getAllStudents(req: IRequest, res: Response) {
  StudentModel.find()
    .then((allStudent) => generateHttpRes(res, 200, 'student_found', allStudent))
    .catch(() => generateHttpRes(res, 404, 'fetch_students_error'));
}

export function getStudent(req: IRequest, res: Response) {
  StudentModel.findById({ _id: req.params.id })
    .populate('receiptIds')
    .then((found) => {
      if (found) {
        return generateHttpRes(res, 200, 'student_found', found);
      }
      throw new Error();
    })
    .catch(() => generateHttpRes(res, 404, 'student_not_found'));
}

export function postStudent(req: IBackendRequest<IStudent>, res: Response) {
  StudentModelBuilder(req.body)
    .then((newS) => generateHttpRes(res, 201, 'student_created', newS))
    .catch(() => generateHttpRes(res, 500, 'student_creation_error'));
}

export function putStudent(req: IBackendRequest<IStudent>, res: Response) {
  StudentModel.updateOne({ _id: req.params.id }, req.body)
    .then((s) => generateHttpRes(res, 200, 'student_updated', s))
    .catch(() => generateHttpRes(res, 500, 'update_fail'));
}

export function deleteStudent(req: IRequest, res: Response) {
  StudentModel.deleteOne({ _id: req.params.id })
    .then((r) => {
      if (r.deletedCount && r.deletedCount > 0) {
        return generateHttpRes(res, 200, 'student_deleted');
      }
      throw new Error();
    })
    .catch(() => generateHttpRes(res, 500, 'delete_fail'));
}
