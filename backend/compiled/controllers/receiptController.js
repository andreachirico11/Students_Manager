"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceipt = exports.putReceipt = exports.postReceipt = void 0;
var UserResponse_1 = require("../models/interfaces/UserResponse");
var receiptModel_1 = require("../models/receiptModel");
var studentModell_1 = require("../models/studentModell");
var httpFailFunction_1 = require("../utils/httpFailFunction");
function postReceipt(req, res) {
    receiptModel_1.ReceiptModelBuilder(req.body)
        .then(function (receipt) {
        if (receipt) {
            return studentModell_1.StudentModel.updateOne({ _id: req.params.studentId }, { $push: { receiptIds: receipt._id } });
        }
        throw new Error();
    })
        .then(function (s) { return res.status(200).json(new UserResponse_1.HttpResponse('student_updated_with_receipt', s)); })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'receipt_creation_fail'); });
}
exports.postReceipt = postReceipt;
function putReceipt(req, res) {
    receiptModel_1.ReceiptModel.findById({ _id: req.params.receiptId })
        .then(function (r) {
        if (r) {
            r.number = req.body.number;
            r.amount = req.body.amount;
            r.emissionDate = req.body.emissionDate;
            r.paymentDate = req.body.paymentDate;
            r.typeOfPayment = req.body.typeOfPayment;
            return r.save();
        }
        throw new Error();
    })
        .then(function (r) { return res.status(200).json(new UserResponse_1.HttpResponse('receipt_updated', r)); })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'update_fail'); });
}
exports.putReceipt = putReceipt;
function deleteReceipt(req, res) {
    var recId = req.params.id;
    studentModell_1.StudentModel.findOne({ receiptIds: recId })
        .then(function (s) {
        if (s && s.receiptIds) {
            return s.updateOne({ $pull: { receiptIds: recId } });
        }
        return;
    })
        .then(function (s) {
        return receiptModel_1.ReceiptModel.deleteOne({ _id: recId });
    })
        .then(function (r) {
        if (r.deletedCount && r.deletedCount > 0) {
            return res.status(200).json(new UserResponse_1.HttpResponse('receipt_deleted'));
        }
        throw new Error();
    })
        .catch(function () { return httpFailFunction_1.fail(res, 500, 'delete_fail'); });
}
exports.deleteReceipt = deleteReceipt;
//# sourceMappingURL=receiptController.js.map