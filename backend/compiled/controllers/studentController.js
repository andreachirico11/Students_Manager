"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.putStudent = exports.getAllStudents = exports.getStudent = exports.postStudent = void 0;
var UserResponse_1 = require("../models/interfaces/UserResponse");
var studentModell_1 = require("../models/studentModell");
var httpFailFunction_1 = require("../utils/httpFailFunction");
function postStudent(req, res) {
    studentModell_1.StudentModelBuilder(req.body)
        .then(function (newS) { return res.status(201).json(new UserResponse_1.HttpResponse('student_created', newS)); })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'student_creation_error'); });
}
exports.postStudent = postStudent;
function getStudent(req, res) {
    studentModell_1.StudentModel.findById({ _id: req.params.id })
        .populate('receiptIds')
        .then(function (found) {
        if (found) {
            return res.status(200).json(new UserResponse_1.HttpResponse('student_found', found));
        }
        throw new Error();
    })
        .catch(function () { return httpFailFunction_1.fail(res, 404, 'student_not_found'); });
}
exports.getStudent = getStudent;
function getAllStudents(req, res) {
    studentModell_1.StudentModel.find()
        .then(function (allStudent) { return res.status(200).json(new UserResponse_1.HttpResponse('student_found', allStudent)); })
        .catch(function () { return httpFailFunction_1.fail(res, 404, 'fetch_students_error'); });
}
exports.getAllStudents = getAllStudents;
function putStudent(req, res) {
    studentModell_1.StudentModel.updateOne({ _id: req.params.id }, req.body)
        .then(function (s) { return res.status(200).json(new UserResponse_1.HttpResponse('student_updated', s)); })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'update_fail'); });
}
exports.putStudent = putStudent;
function deleteStudent(req, res) {
    studentModell_1.StudentModel.deleteOne({ _id: req.params.id })
        .then(function (r) {
        if (r.deletedCount && r.deletedCount > 0) {
            return res.status(200).json(new UserResponse_1.HttpResponse('student_deleted'));
        }
        throw new Error();
    })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'delete_fail'); });
}
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=studentController.js.map