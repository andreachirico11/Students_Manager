"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMessages = exports.UserMessages = exports.TokenErrors = void 0;
var TokenErrors;
(function (TokenErrors) {
    TokenErrors["Invalid_token"] = "Invalid_token";
    TokenErrors["Token_not_found"] = "Token_not_found";
})(TokenErrors = exports.TokenErrors || (exports.TokenErrors = {}));
var UserMessages;
(function (UserMessages) {
    UserMessages["user_not_found"] = "user_not_found";
    UserMessages["user_found"] = "user_found";
    UserMessages["wrong_credentials"] = "wrong_credentials";
    UserMessages["user_registered"] = "user_registered";
})(UserMessages = exports.UserMessages || (exports.UserMessages = {}));
var ServerMessages;
(function (ServerMessages) {
    ServerMessages["hashing_fail"] = "hashing_fail";
    ServerMessages["user_creation_error"] = "user_creation_error";
})(ServerMessages = exports.ServerMessages || (exports.ServerMessages = {}));
//# sourceMappingURL=errorEnums.js.map