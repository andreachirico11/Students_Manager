"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHttpRes = void 0;
var httpResponse_1 = require("../models/httpResponse");
var generateHttpRes = function (res, code, title, payload) {
    res.status(code).json(new httpResponse_1.HttpResponse(title, payload));
};
exports.generateHttpRes = generateHttpRes;
//# sourceMappingURL=httpRespGenerator.js.map