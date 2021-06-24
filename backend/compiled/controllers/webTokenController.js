"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
var messageEnums_1 = require("../models/messageEnums");
var longString = (_a = process.env.SECRET_AUTH_STRING) !== null && _a !== void 0 ? _a : 'SECRET_AUTH_STRING';
var expirationTime = (_b = process.env.TOKEN_EXPIRATION_DATE) !== null && _b !== void 0 ? _b : '1d';
function generateToken(user) {
    var userToAttach = {
        email: user.email,
        id: user._id,
        name: user.name,
        password: user.password,
    };
    return {
        token: jsonwebtoken_1.sign(userToAttach, longString, { expiresIn: expirationTime }),
        expiresIn: getExpirationMillis(expirationTime),
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
        httpRespGenerator_1.generateHttpRes(res, 401, errorMsg);
    }
}
exports.verifyToken = verifyToken;
function getExpirationMillis(expirationTime) {
    var _a = expirationTime
        .split('')
        .map(function (x) { return (isNaN(Number(x)) ? x : Number(x)); }), howMany = _a[0], measure = _a[1];
    if (!howMany || typeof howMany === 'string') {
        return 86400000;
    }
    switch (measure) {
        case 'd':
        default:
            return 86400000 * howMany;
        case 'h':
            return 3600000 * howMany;
        case 'm':
            return 60000 * howMany;
    }
}
//# sourceMappingURL=webTokenController.js.map