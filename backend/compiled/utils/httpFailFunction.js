"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = void 0;
var HttpResponse_1 = require("../models/interfaces/responses/HttpResponse");
var fail = function (res, code, title, err) {
    res.status(code).json(new HttpResponse_1.HttpResponse(title, err));
};
exports.fail = fail;
//# sourceMappingURL=httpFailFunction.js.map