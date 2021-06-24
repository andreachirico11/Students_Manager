"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptModelBuilder = exports.ReceiptModel = void 0;
var mongoose_1 = require("mongoose");
exports.ReceiptModel = mongoose_1.model('Receipt', new mongoose_1.Schema({
    number: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    emissionDate: {
        type: Date,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    typeOfPayment: {
        type: String,
        required: true,
    },
    _studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
    },
}));
function ReceiptModelBuilder(Receipt, studentId) {
    return exports.ReceiptModel.create(__assign(__assign({}, Receipt), { _studentId: studentId }));
}
exports.ReceiptModelBuilder = ReceiptModelBuilder;
//# sourceMappingURL=receiptModel.js.map