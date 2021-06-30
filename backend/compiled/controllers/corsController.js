"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsController = void 0;
var origins = (_a = process.env.ALLOWED_ORIGINS) !== null && _a !== void 0 ? _a : '*';
function corsController(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', origins);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, auth-token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
}
exports.corsController = corsController;
//# sourceMappingURL=corsController.js.map