"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModelBuilder = exports.StudentModel = void 0;
var mongoose_1 = require("mongoose");
exports.StudentModel = mongoose_1.model('Student', new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    shoolClass: {
        type: String,
    },
    fiscalCode: {
        type: String,
    },
    address: {
        type: String,
    },
    notes: {
        type: String,
    },
    receiptIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    parentIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Parent',
        },
    ],
}));
function StudentModelBuilder(Student) {
    return exports.StudentModel.create(Student);
}
exports.StudentModelBuilder = StudentModelBuilder;
//# sourceMappingURL=studentModell.js.map