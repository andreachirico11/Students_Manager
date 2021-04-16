"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptMessages = exports.StudentMessages = exports.ServerMessages = exports.UserMessages = exports.TokenErrors = void 0;
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
    ServerMessages["creation_error"] = "creation_error";
    ServerMessages["fetch_error"] = "fetch_error";
    ServerMessages["update_error"] = "update_error";
    ServerMessages["delete_error"] = "delete_error";
})(ServerMessages = exports.ServerMessages || (exports.ServerMessages = {}));
var StudentMessages;
(function (StudentMessages) {
    StudentMessages["student_deleted"] = "student_deleted";
    StudentMessages["student_updated"] = "student_updated";
    StudentMessages["student_created"] = "student_created";
    StudentMessages["student_found"] = "student_found";
    StudentMessages["student_not_found"] = "student_not_found";
})(StudentMessages = exports.StudentMessages || (exports.StudentMessages = {}));
var ReceiptMessages;
(function (ReceiptMessages) {
    ReceiptMessages["receipt_deleted"] = "receipt_deleted";
    ReceiptMessages["receipt_updated"] = "receipt_updated";
    ReceiptMessages["receipt_created"] = "receipt_created";
    ReceiptMessages["receipt_found"] = "receipt_found";
    ReceiptMessages["receipt_not_found"] = "receipt_not_found";
})(ReceiptMessages = exports.ReceiptMessages || (exports.ReceiptMessages = {}));
//# sourceMappingURL=messageEnums%20copy.js.map