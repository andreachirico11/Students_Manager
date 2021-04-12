"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = void 0;
var UserResponse_1 = require("../models/interfaces/UserResponse");
var fail = function (res, code, title, err) {
    res.status(code).json(new UserResponse_1.HttpResponse(title, err));
};
exports.fail = fail;
//# sourceMappingURL=httpSuccessFunction.js.map