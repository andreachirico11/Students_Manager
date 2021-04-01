"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUser = void 0;
var userModel_1 = require("../models/userModel");
var HttpResponse_1 = require("../models/interfaces/HttpResponse");
function postUser(req, res, nex) {
    var newUser = userModel_1.UserModelBuilder({
        email: 'abc@gmail',
        password: '12345',
        name: 'gianni',
    });
    newUser
        .save()
        .then(function (result) {
        res.status(201).json(new HttpResponse_1.HttpResponse('user registred', '', result));
    })
        .catch(console.error);
}
exports.postUser = postUser;
//# sourceMappingURL=userController.js.map