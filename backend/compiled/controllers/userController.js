"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.postUser = void 0;
var bcrypt_1 = require("bcrypt");
var HttpResponse_1 = require("../models/interfaces/HttpResponse");
var userModel_1 = require("../models/userModel");
function postUser(req, res, nex) {
    var newUser = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name || '',
    };
    if (!newUser.email || !newUser.password || !newUser.name) {
        res.status(500).json(new HttpResponse_1.HttpResponse('signup_failed'));
    }
    bcrypt_1.hash(newUser.password, 10).then(function (hashedPassword) {
        newUser.password = hashedPassword;
        userModel_1.UserModelBuilder(newUser)
            .then(function (u) {
            u.save()
                .then(function (result) {
                res.status(201).json(new HttpResponse_1.HttpResponse('user_registred', result));
            })
                .catch(console.error);
        })
            .catch(console.error);
    });
}
exports.postUser = postUser;
function getUser(req, res, nex) {
    var foundUser;
    var fail = function (title, err) { return res.status(404).json(new HttpResponse_1.HttpResponse(title, err)); };
    var _a = req.body, email = _a.email, password = _a.password;
    if (!password || !email) {
        return fail('no_credentials');
    }
    userModel_1.UserModel.findOne({ email: req.body.email })
        .then(function (found) {
        if (found) {
            foundUser = found;
            return bcrypt_1.compare(found.password, req.body.password);
        }
        fail('user_not_found');
    })
        .then(function (result) {
        // sempre false
        //   res.status(200).json(new HttpResponse('user_found', found));
    })
        .catch(fail);
}
exports.getUser = getUser;
//# sourceMappingURL=userController.js.map