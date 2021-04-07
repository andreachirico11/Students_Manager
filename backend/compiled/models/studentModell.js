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
function StudentModelBuilder(Student, id) {
    return exports.StudentModel.create(__assign(__assign({}, Student), { id: id }));
}
exports.StudentModelBuilder = StudentModelBuilder;
//# sourceMappingURL=studentModell.js.map