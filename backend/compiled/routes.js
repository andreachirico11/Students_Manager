"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var receiptController_1 = require("./controllers/receiptController");
var studentController_1 = require("./controllers/studentController");
var userController_1 = require("./controllers/userController");
var router = express_1.Router();
exports.router = router;
router.post('/user/signup', userController_1.postUser);
router.post('/user/login', userController_1.getUser);
router.put('/students/:id', studentController_1.putStudent);
router.delete('/students/:id', studentController_1.deleteStudent);
router.post('/students', studentController_1.postStudent);
router.get('/students/:id', studentController_1.getStudent);
router.get('/students', studentController_1.getAllStudents);
router.post('/receipts/:id', receiptController_1.postReceipt);
//# sourceMappingURL=routes.js.map