"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReceipt = void 0;
var HttpResponse_1 = require("../models/interfaces/responses/HttpResponse");
var receiptModel_1 = require("../models/receiptModel");
var studentModell_1 = require("../models/studentModell");
var httpFailFunction_1 = require("../utils/httpFailFunction");
function postReceipt(req, res, nex) {
    receiptModel_1.ReceiptModelBuilder(req.body)
        .then(function (receipt) {
        if (receipt) {
            return studentModell_1.StudentModel.updateOne({ _id: req.params.id }, { receiptIds: receipt._id });
        }
        throw new Error();
    })
        .then(function (s) { return res.status(200).json(new HttpResponse_1.HttpResponse('student_updated_with_receipt', s)); })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'receipt_creation_fail'); });
}
exports.postReceipt = postReceipt;
// export function postStudent(req: IStudentPostRequest, res: Response, nex: NextFunction) {
//   const newStudent: IStudent = {
//     name: req.body.name,
//     surname: req.body.surname,
//     dateOfBirth: req.body.dateOfBirth,
//     address: req.body.address,
//     fiscalCode: req.body.fiscalCode,
//     schoolClass: req.body.schoolClass,
//     notes: req.body.notes,
//   };
//   StudentModelBuilder(newStudent)
//     .then((newS) => res.status(201).json(new HttpResponse('student_created', newS)))
//     .catch(() => fail(res, 500, 'student_creation_error'));
// }
// export function getStudent(req: Request, res: Response, nex: NextFunction) {
//   StudentModel.findById({ _id: req.params.id })
//     .then((found) => res.status(200).json(new HttpResponse('student_found', found)))
//     .catch(() => fail(res, 404, 'student_not_found'));
// }
// export function getAllStudents(req: Request, res: Response, nex: NextFunction) {
//   StudentModel.find()
//     .then((allStudent) => res.status(200).json(new HttpResponse('student_found', allStudent)))
//     .catch(() => fail(res, 404, 'fetch_students_error'));
// }
// export function putStudent(req: IStudentPostRequest, res: Response, nex: NextFunction) {
//   StudentModel.findById({ _id: req.params.id })
//     .then((s) => {
//       if (s) {
//         s.name = req.body.name;
//         s.surname = req.body.surname;
//         s.dateOfBirth = req.body.dateOfBirth;
//         s.address = req.body.address;
//         s.schoolClass = req.body.schoolClass;
//         s.fiscalCode = req.body.fiscalCode;
//         s.address = req.body.address;
//         s.notes = req.body.notes;
//         s.parentIds = req.body.parentIds;
//         s.receiptIds = req.body.receiptIds;
//         return s.save();
//       }
//       throw new Error();
//     })
//     .then((s) => res.status(200).json(new HttpResponse('student_updated', s)))
//     .catch(() => fail(res, 500, 'update_fail'));
// }
// export function deleteStudent(req: IStudentPostRequest, res: Response, nex: NextFunction) {
//   StudentModel.deleteOne({ _id: req.params.id })
//     .then((r) => {
//       if (r.deletedCount && r.deletedCount > 0) {
//         return res.status(200).json(new HttpResponse('student_deleted'));
//       }
//       throw new Error();
//     })
//     .catch(() => fail(res, 500, 'delete_fail'));
// }
//# sourceMappingURL=receiptController.js.map