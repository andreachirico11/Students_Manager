"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
var messageEnums_1 = require("../models/messageEnums");
var longString = process.env.SECRET_AUTH_STRING || 'SECRET_AUTH_STRING';
function generateToken(user) {
    var userToAttach = {
        email: user.email,
        id: user._id,
        name: user.name,
        password: user.password,
    };
    return {
        token: jsonwebtoken_1.sign(userToAttach, longString, { expiresIn: '1h' }),
        expiresIn: 3600,
        loggedUserId: user._id,
    };
}
exports.generateToken = generateToken;
function verifyToken(req, res, next) {
    var errorMsg = messageEnums_1.TokenErrors.Invalid_token;
    try {
        var token = req.headers['auth-token'];
        if (!token) {
            errorMsg = messageEnums_1.TokenErrors.Token_not_found;
            throw new Error();
        }
        var verifiedToken = jsonwebtoken_1.verify(token, longString);
        // in futuro si puo usare per attaccare user alla req
        next();
    }
    catch (e) {
        console.log(e);
        httpRespGenerator_1.generateHttpRes(res, 401, errorMsg);
    }
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=webTokenController.js.map