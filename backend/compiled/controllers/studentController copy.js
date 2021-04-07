"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.putStudent = exports.getAllStudents = exports.getStudent = exports.postStudent = void 0;
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
function putStudent(req, res, nex) {
    studentModell_1.StudentModel.findById({ _id: req.params.id })
        .then(function (s) {
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
        .then(function (s) { return res.status(200).json(new HttpResponse_1.HttpResponse('student_updated', s)); })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'update_fail'); });
}
exports.putStudent = putStudent;
function deleteStudent(req, res, nex) {
    studentModell_1.StudentModel.deleteOne({ _id: req.params.id })
        .then(function (r) {
        if (r.deletedCount && r.deletedCount > 0) {
            return res.status(200).json(new HttpResponse_1.HttpResponse('student_deleted'));
        }
        throw new Error();
    })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'delete_fail'); });
}
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=studentController%20copy.js.map