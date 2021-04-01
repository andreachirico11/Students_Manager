"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var userController_1 = require("./controllers/userController");
var router = express_1.Router();
exports.router = router;
router.post('/user/signup', userController_1.postUser);
//# sourceMappingURL=routes.js.map