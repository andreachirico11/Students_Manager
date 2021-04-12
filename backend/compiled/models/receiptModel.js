"use strict";
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
        type: Number,
        required: true,
    },
}));
function ReceiptModelBuilder(Receipt) {
    return exports.ReceiptModel.create(Receipt);
}
exports.ReceiptModelBuilder = ReceiptModelBuilder;
//# sourceMappingURL=receiptModel.js.map