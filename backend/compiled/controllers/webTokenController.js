"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
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
function verifyToken() {
    // TODO
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=webTokenController.js.map