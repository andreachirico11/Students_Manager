"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.putStudent = exports.getAllStudents = exports.getStudent = exports.postStudent = void 0;
var studentModell_1 = require("../models/studentModell");
var httpFailFunction_1 = require("../utils/httpFailFunction");
function postStudent(req, res) {
    studentModell_1.StudentModelBuilder(req.body)
        .then(function (newS) { return httpFailFunction_1.generateHttpRes(res, 201, 'student_created', newS); })
        .catch(function () { return httpFailFunction_1.generateHttpRes(res, 500, 'student_creation_error'); });
}
exports.postStudent = postStudent;
function getStudent(req, res) {
    studentModell_1.StudentModel.findById({ _id: req.params.id })
        .populate('receiptIds')
        .then(function (found) {
        if (found) {
            return httpFailFunction_1.generateHttpRes(res, 200, 'student_found', found);
        }
        throw new Error();
    })
        .catch(function () { return httpFailFunction_1.generateHttpRes(res, 404, 'student_not_found'); });
}
exports.getStudent = getStudent;
function getAllStudents(req, res) {
    studentModell_1.StudentModel.find()
        .then(function (allStudent) { return httpFailFunction_1.generateHttpRes(res, 200, 'student_found', allStudent); })
        .catch(function () { return httpFailFunction_1.generateHttpRes(res, 404, 'fetch_students_error'); });
}
exports.getAllStudents = getAllStudents;
function putStudent(req, res) {
    studentModell_1.StudentModel.updateOne({ _id: req.params.id }, req.body)
        .then(function (s) { return httpFailFunction_1.generateHttpRes(res, 200, 'student_updated', s); })
        .catch(function () { return httpFailFunction_1.generateHttpRes(res, 500, 'update_fail'); });
}
exports.putStudent = putStudent;
function deleteStudent(req, res) {
    studentModell_1.StudentModel.deleteOne({ _id: req.params.id })
        .then(function (r) {
        if (r.deletedCount && r.deletedCount > 0) {
            return httpFailFunction_1.generateHttpRes(res, 200, 'student_deleted');
        }
        throw new Error();
    })
        .catch(function () { return httpFailFunction_1.generateHttpRes(res, 500, 'delete_fail'); });
}
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=studentController.js.map