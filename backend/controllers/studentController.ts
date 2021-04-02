import { NextFunction, Request, Response } from 'express';
import { IStudentRequest } from '../models/interfaces/requests/IStudentRequest';
import { HttpResponse } from '../models/interfaces/responses/HttpResponse';
import { IStudent } from '../models/interfaces/Student';
import { StudentModel, StudentModelBuilder } from '../models/studentModell';
import { fail } from '../utils/httpFailFunction';

export function postStudent(req: IStudentRequest, res: Response, nex: NextFunction) {
  const newStudent: IStudent = {
    name: req.body.name,
    surname: req.body.surname,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    fiscalCode: req.body.fiscalCode,
    schoolClass: req.body.schoolClass,
    notes: req.body.notes,
  };
  StudentModelBuilder(newStudent)
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
// export function getUser(req: IUserRequest, res: Response, nex: NextFunction) {
//   let foundUser: IMongoUser;
//   const { email, password } = req.body;
//   if (!password || !email) {
//     return fail(res, 404, 'no_credentials');
//   }
//   UserModel.findOne({ email: req.body.email })
//     .then((found) => {
//       if (found) {
//         foundUser = found;
//         return compare(req.body.password, found.password);
//       }
//       throw new Error('not_found_in_db');
//     })
//     .then((result) => {
//       if (!result) {
//         return fail(res, 401, 'wrong_password');
//       }
//       res.status(200).json(new HttpResponse('user_found', generateToken(foundUser)));
//     })
//     .catch((e) => fail(res, 404, 'user_not_found', e));
// }
