"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.putStudent = exports.postStudent = exports.getStudent = exports.getAllStudents = void 0;
var Student_1 = require("../models/interfaces/Student");
var messageEnums_1 = require("../models/messageEnums");
var receiptModel_1 = require("../models/receiptModel");
var studentModell_1 = require("../models/studentModell");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
function getAllStudents(req, res) {
    studentModell_1.StudentModel.find()
        .then(function (allStudent) {
        return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.StudentMessages.student_found, Student_1.parseToFront(allStudent));
    })
        .catch(function () { return httpRespGenerator_1.generateHttpRes(res, 404, messageEnums_1.StudentMessages.student_not_found); });
}
exports.getAllStudents = getAllStudents;
function getStudent(req, res) {
    studentModell_1.StudentModel.findById({ _id: req.params.id })
        .populate('receiptIds')
        .then(function (found) {
        if (found) {
            return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.StudentMessages.student_found, Student_1.parseToFront(found));
        }
        throw new Error();
    })
        .catch(function () { return httpRespGenerator_1.generateHttpRes(res, 404, messageEnums_1.StudentMessages.student_not_found); });
}
exports.getStudent = getStudent;
function postStudent(req, res) {
    studentModell_1.StudentModelBuilder(req.body)
        .then(function (newS) { return httpRespGenerator_1.generateHttpRes(res, 201, messageEnums_1.StudentMessages.student_created, newS); })
        .catch(function () { return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.creation_error); });
}
exports.postStudent = postStudent;
function putStudent(req, res) {
    studentModell_1.StudentModel.updateOne({ _id: req.params.id }, req.body)
        .then(function (s) { return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.StudentMessages.student_updated, s); })
        .catch(function () { return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.update_error); });
}
exports.putStudent = putStudent;
function deleteStudent(req, res) {
    var studentId = req.params.id;
    studentModell_1.StudentModel.deleteOne({ _id: studentId })
        .then(function (r) {
        if (r.deletedCount && r.deletedCount > 0) {
            return receiptModel_1.ReceiptModel.deleteMany({ _studentId: studentId });
        }
        throw new Error();
    })
        .then(function (r) {
        if (r.deletedCount && r.deletedCount > 0) {
            return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.StudentMessages.student_deleted);
        }
        throw new Error();
    })
        .catch(function () { return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.delete_error); });
}
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=studentController.js.map