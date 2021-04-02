"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudents = exports.getStudent = exports.postStudent = void 0;
var HttpResponse_1 = require("../models/interfaces/responses/HttpResponse");
var studentModell_1 = require("../models/studentModell");
var httpFailFunction_1 = require("../utils/httpFailFunction");
function postStudent(req, res, nex) {
    var newStudent = {
        name: req.body.name,
        surname: req.body.surname,
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address,
        fiscalCode: req.body.fiscalCode,
        schoolClass: req.body.schoolClass,
        notes: req.body.notes,
    };
    studentModell_1.StudentModelBuilder(newStudent)
        .then(function (newS) { return res.status(201).json(new HttpResponse_1.HttpResponse('student_created', newS)); })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'student_creation_error'); });
}
exports.postStudent = postStudent;
function getStudent(req, res, nex) {
    studentModell_1.StudentModel.findById({ _id: req.params.id })
        .then(function (found) { return res.status(200).json(new HttpResponse_1.HttpResponse('student_found', found)); })
        .catch(function () { return httpFailFunction_1.fail(res, 404, 'student_not_found'); });
}
exports.getStudent = getStudent;
function getAllStudents(req, res, nex) {
    studentModell_1.StudentModel.find()
        .then(function (allStudent) { return res.status(200).json(new HttpResponse_1.HttpResponse('student_found', allStudent)); })
        .catch(function () { return httpFailFunction_1.fail(res, 404, 'fetch_students_error'); });
}
exports.getAllStudents = getAllStudents;
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
//# sourceMappingURL=studentController.js.map