"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.postUser = void 0;
var bcrypt_1 = require("bcrypt");
var HttpResponse_1 = require("../models/interfaces/HttpResponse");
var userModel_1 = require("../models/userModel");
var webTokenController_1 = require("./webTokenController");
var fail = function (res, code, title, err) {
    res.status(code).json(new HttpResponse_1.HttpResponse(title, err));
};
function postUser(req, res, nex) {
    var newUser = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name || '',
    };
    if (!newUser.email || !newUser.password || !newUser.name) {
        return fail(res, 500, 'signup_failed');
    }
    bcrypt_1.hash(newUser.password, 10).then(function (hashedPassword) {
        newUser.password = hashedPassword;
        userModel_1.UserModelBuilder(newUser)
            .then(function (u) {
            u.save()
                .then(function (created) {
                res.status(201).json(new HttpResponse_1.HttpResponse('user_registred', webTokenController_1.generateToken(created)));
            })
                .catch(function (e) { return fail(res, 500, 'save_error', e); });
        })
            .catch(function (e) { return fail(res, 500, 'hashing_fail', e); });
    });
}
exports.postUser = postUser;
function getUser(req, res, nex) {
    var foundUser;
    var _a = req.body, email = _a.email, password = _a.password;
    if (!password || !email) {
        return fail(res, 404, 'no_credentials');
    }
    userModel_1.UserModel.findOne({ email: req.body.email })
        .then(function (found) {
        if (found) {
            foundUser = found;
            return bcrypt_1.compare(req.body.password, found.password);
        }
        throw new Error('not_found_in_db');
    })
        .then(function (result) {
        if (!result) {
            return fail(res, 401, 'wrong_password');
        }
        res.status(200).json(new HttpResponse_1.HttpResponse('user_found', webTokenController_1.generateToken(foundUser)));
    })
        .catch(function (e) { return fail(res, 404, 'user_not_found', e); });
}
exports.getUser = getUser;
//# sourceMappingURL=userController%20copy.js.map