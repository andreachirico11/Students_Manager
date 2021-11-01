"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var pdfPrintoutController_1 = require("./controllers/pdfPrintoutController");
var receiptController_1 = require("./controllers/receiptController");
var studentController_1 = require("./controllers/studentController");
var userController_1 = require("./controllers/userController");
var webTokenController_1 = require("./controllers/webTokenController");
var router = express_1.Router();
exports.router = router;
router.post('/user/signup', userController_1.postUser);
router.post('/user/login', userController_1.getUser);
router.put('/students/:id', webTokenController_1.verifyToken, studentController_1.putStudent);
router.delete('/students/:id', webTokenController_1.verifyToken, studentController_1.deleteStudent);
router.post('/students', webTokenController_1.verifyToken, studentController_1.postStudent);
router.get('/students/:id', webTokenController_1.verifyToken, studentController_1.getStudent);
router.get('/students', webTokenController_1.verifyToken, studentController_1.getAllStudents);
router.post('/receipts/:studentId', webTokenController_1.verifyToken, receiptController_1.postReceipt);
router.put('/receipts/:receiptId', webTokenController_1.verifyToken, receiptController_1.putReceipt);
router.delete('/receipts/:id', webTokenController_1.verifyToken, receiptController_1.deleteReceipt);
router.get('/printout', pdfPrintoutController_1.getPdf);
//# sourceMappingURL=routes.js.map