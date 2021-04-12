import { Request, Response } from 'express';
import { IBackendRequest } from '../models/interfaces/IRequests';
import { HttpResponse } from '../models/interfaces/UserResponse';
import { IStudent } from '../models/interfaces/Student';
import { StudentModel, StudentModelBuilder } from '../models/studentModell';
import { fail } from '../utils/httpFailFunction';

export function postStudent(req: IBackendRequest<IStudent>, res: Response) {
  StudentModelBuilder(req.body)
    .then((newS) => res.status(201).json(new HttpResponse('student_created', newS)))
    .catch(() => fail(res, 500, 'student_creation_error'));
}

export function getStudent(req: Request, res: Response) {
  StudentModel.findById({ _id: req.params.id })
    .populate('receiptIds')
    .then((found) => {
      if (found) {
        return res.status(200).json(new HttpResponse('student_found', found));
      }
      throw new Error();
    })
    .catch(() => fail(res, 404, 'student_not_found'));
}

export function getAllStudents(req: Request, res: Response) {
  StudentModel.find()
    .then((allStudent) => res.status(200).json(new HttpResponse('student_found', allStudent)))
    .catch(() => fail(res, 404, 'fetch_students_error'));
}

export function putStudent(req: IBackendRequest<IStudent>, res: Response) {
  StudentModel.updateOne({ _id: req.params.id }, req.body)
    .then((s) => res.status(200).json(new HttpResponse('student_updated', s)))
    .catch(() => fail(res, 500, 'update_fail'));
}

export function deleteStudent(req: Request, res: Response) {
  StudentModel.deleteOne({ _id: req.params.id })
    .then((r) => {
      if (r.deletedCount && r.deletedCount > 0) {
        return res.status(200).json(new HttpResponse('student_deleted'));
      }
      throw new Error();
    })
    .catch(() => fail(res, 500, 'delete_fail'));
}
