import { NextFunction, Request, Response } from 'express';
import { IStudentPostRequest } from '../models/interfaces/requests/IStudentRequest';
import { HttpResponse } from '../models/interfaces/responses/HttpResponse';
import { IStudent } from '../models/interfaces/Student';
import { StudentModel, StudentModelBuilder } from '../models/studentModell';
import { fail } from '../utils/httpFailFunction';

export function postStudent(req: IStudentPostRequest, res: Response, nex: NextFunction) {
  // const newStudent: IStudent = {
  //   name: req.body.name,
  //   surname: req.body.surname,
  //   dateOfBirth: req.body.dateOfBirth,
  //   address: req.body.address,
  //   fiscalCode: req.body.fiscalCode,
  //   schoolClass: req.body.schoolClass,
  //   notes: req.body.notes,
  // };
  StudentModelBuilder(req.body)
    .then((newS) => res.status(201).json(new HttpResponse('student_created', newS)))
    .catch(() => fail(res, 500, 'student_creation_error'));
}

export function getStudent(req: Request, res: Response, nex: NextFunction) {
  StudentModel.findById({ _id: req.params.id })
    .then((found) => res.status(200).json(new HttpResponse('student_found', found)))
    .catch(() => fail(res, 404, 'student_not_found'));
}

export function getAllStudents(req: Request, res: Response, nex: NextFunction) {
  StudentModel.find()
    .then((allStudent) => res.status(200).json(new HttpResponse('student_found', allStudent)))
    .catch(() => fail(res, 404, 'fetch_students_error'));
}

export function putStudent(req: IStudentPostRequest, res: Response, nex: NextFunction) {
  StudentModel.findById({ _id: req.params.id })
    .then((s) => {
      if (s) {
        s.name = req.body.name;
        s.surname = req.body.surname;
        s.dateOfBirth = req.body.dateOfBirth;
        s.address = req.body.address;
        s.schoolClass = req.body.schoolClass;
        s.fiscalCode = req.body.fiscalCode;
        s.address = req.body.address;
        s.notes = req.body.notes;
        s.parentIds = req.body.parentIds;
        s.receiptIds = req.body.receiptIds;

        return s.save();
      }
      throw new Error();
    })
    .then((s) => res.status(200).json(new HttpResponse('student_updated', s)))
    .catch(() => fail(res, 500, 'update_fail'));
}

export function deleteStudent(req: IStudentPostRequest, res: Response, nex: NextFunction) {
  StudentModel.deleteOne({ _id: req.params.id })
    .then((r) => {
      if (r.deletedCount && r.deletedCount > 0) {
        return res.status(200).json(new HttpResponse('student_deleted'));
      }
      throw new Error();
    })
    .catch(() => fail(res, 500, 'delete_fail'));
}
