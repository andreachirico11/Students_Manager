"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceipt = exports.putReceipt = exports.postReceipt = void 0;
var messageEnums_1 = require("../models/messageEnums");
var receiptModel_1 = require("../models/receiptModel");
var studentModell_1 = require("../models/studentModell");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
function postReceipt(req, res) {
    var receiptToSend;
    receiptModel_1.ReceiptModelBuilder(req.body, req.params.studentId)
        .then(function (receipt) {
        if (receipt) {
            receiptToSend = receipt;
            return studentModell_1.StudentModel.updateOne({ _id: req.params.studentId }, { $push: { receiptIds: receipt._id } });
        }
        throw new Error();
    })
        .then(function () { return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.ReceiptMessages.receipt_created, receiptToSend); })
        .catch(function (err) { return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.creation_error); });
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
        .then(function (r) { return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.ReceiptMessages.receipt_updated, r); })
        .catch(function () { return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.update_error); });
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
            return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.ReceiptMessages.receipt_deleted);
        }
        throw new Error();
    })
        .catch(function () { return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.delete_error); });
}
exports.deleteReceipt = deleteReceipt;
//# sourceMappingURL=receiptController%20copy.js.map