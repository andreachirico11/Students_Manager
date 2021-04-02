"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var studentController_1 = require("./controllers/studentController");
var userController_1 = require("./controllers/userController");
var router = express_1.Router();
exports.router = router;
router.post('/user/signup', userController_1.postUser);
router.post('/user/login', userController_1.getUser);
router.post('/students', studentController_1.postStudent);
router.get('/students/:id', studentController_1.getStudent);
router.get('/students', studentController_1.getAllStudents);
//# sourceMappingURL=routes.js.map