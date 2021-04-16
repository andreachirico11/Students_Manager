import { Response } from 'express';
import { IBackendRequest, IRequest } from '../models/interfaces/IRequests';
import { IStudent } from '../models/interfaces/Student';
import { ServerMessages, StudentMessages } from '../models/messageEnums';
import { StudentModel, StudentModelBuilder } from '../models/studentModell';
import { generateHttpRes } from '../utils/httpRespGenerator';

export function getAllStudents(req: IRequest, res: Response) {
  StudentModel.find()
    .then((allStudent) => generateHttpRes(res, 200, StudentMessages.student_found, allStudent))
    .catch(() => generateHttpRes(res, 404, StudentMessages.student_not_found));
}

export function getStudent(req: IRequest, res: Response) {
  StudentModel.findById({ _id: req.params.id })
    .populate('receiptIds')
    .then((found) => {
      if (found) {
        return generateHttpRes(res, 200, StudentMessages.student_found, found);
      }
      throw new Error();
    })
    .catch(() => generateHttpRes(res, 404, StudentMessages.student_not_found));
}

export function postStudent(req: IBackendRequest<IStudent>, res: Response) {
  StudentModelBuilder(req.body)
    .then((newS) => generateHttpRes(res, 201, StudentMessages.student_created, newS))
    .catch(() => generateHttpRes(res, 500, ServerMessages.creation_error));
}

export function putStudent(req: IBackendRequest<IStudent>, res: Response) {
  StudentModel.updateOne({ _id: req.params.id }, req.body)
    .then((s) => generateHttpRes(res, 200, StudentMessages.student_updated, s))
    .catch(() => generateHttpRes(res, 500, ServerMessages.update_error));
}

export function deleteStudent(req: IRequest, res: Response) {
  StudentModel.deleteOne({ _id: req.params.id })
    .then((r) => {
      if (r.deletedCount && r.deletedCount > 0) {
        return generateHttpRes(res, 200, StudentMessages.student_deleted);
      }
      throw new Error();
    })
    .catch(() => generateHttpRes(res, 500, ServerMessages.delete_error));
}
