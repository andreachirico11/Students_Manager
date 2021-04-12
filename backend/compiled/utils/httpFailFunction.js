"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHttpRes = void 0;
var UserResponse_1 = require("../models/interfaces/UserResponse");
var generateHttpRes = function (res, code, title, payload) {
    res.status(code).json(new UserResponse_1.HttpResponse(title, payload));
};
exports.generateHttpRes = generateHttpRes;
//# sourceMappingURL=httpFailFunction.js.map