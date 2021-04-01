"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelBuilder = exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
exports.UserModel = mongoose_1.model('User', new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}));
function UserModelBuilder(user) {
    return new exports.UserModel(user);
}
exports.UserModelBuilder = UserModelBuilder;
//# sourceMappingURL=userModel.js.map