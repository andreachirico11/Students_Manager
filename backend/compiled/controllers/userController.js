"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUser = exports.getUser = exports.postUser = void 0;
var bcrypt_1 = require("bcrypt");
var messageEnums_1 = require("../models/messageEnums");
var userModel_1 = require("../models/userModel");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
var webTokenController_1 = require("./webTokenController");
function postUser(req, res) {
    var newUser = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name || '',
    };
    if (!newUser.email || !newUser.password || !newUser.name) {
        return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.creation_error);
    }
    bcrypt_1.genSalt(20)
        .then(function (salt) {
        return bcrypt_1.hash(newUser.password, salt);
    })
        .then(function (hashedPassword) {
        newUser.password = hashedPassword;
        userModel_1.UserModelBuilder(newUser)
            .then(function (u) {
            u.save()
                .then(function (created) {
                return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.UserMessages.user_registered, webTokenController_1.generateToken(created));
            })
                .catch(function (e) { return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.creation_error); });
        })
            .catch(function (e) { return httpRespGenerator_1.generateHttpRes(res, 500, messageEnums_1.ServerMessages.creation_error); });
    });
}
exports.postUser = postUser;
function getUser(req, res) {
    var foundUser;
    var _a = req.body, email = _a.email, password = _a.password;
    if (!password || !email) {
        return httpRespGenerator_1.generateHttpRes(res, 404, messageEnums_1.UserMessages.wrong_credentials);
    }
    userModel_1.UserModel.findOne({ email: req.body.email })
        .then(function (found) {
        if (found) {
            foundUser = found;
            return bcrypt_1.compare(req.body.password, found.password);
        }
        throw new Error(messageEnums_1.UserMessages.user_not_found);
    })
        .then(function (result) {
        if (!result) {
            return httpRespGenerator_1.generateHttpRes(res, 401, messageEnums_1.UserMessages.wrong_credentials);
        }
        return httpRespGenerator_1.generateHttpRes(res, 200, messageEnums_1.UserMessages.user_found, webTokenController_1.generateToken(foundUser));
    })
        .catch(function (e) { return httpRespGenerator_1.generateHttpRes(res, 404, messageEnums_1.UserMessages.user_not_found); });
}
exports.getUser = getUser;
function createAdminUser(newUser) {
    bcrypt_1.hash(newUser.password, 10).then(function (hashedPassword) {
        newUser.password = hashedPassword;
        userModel_1.UserModelBuilder(newUser).then(function (u) {
            u.save();
        });
    });
}
exports.createAdminUser = createAdminUser;
//# sourceMappingURL=userController.js.map