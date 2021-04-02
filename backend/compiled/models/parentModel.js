"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentModelBuilder = exports.ParentModel = void 0;
var mongoose_1 = require("mongoose");
exports.ParentModel = mongoose_1.model('Parent', new mongoose_1.Schema({
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
    fiscalCode: {
        type: String,
        required: true,
    },
}));
function ParentModelBuilder(Parent) {
    return exports.ParentModel.create(Parent);
}
exports.ParentModelBuilder = ParentModelBuilder;
//# sourceMappingURL=parentModel.js.map