"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToFront = void 0;
var Receipt_1 = require("./Receipt");
function parseToFront(input) {
    if (Array.isArray(input)) {
        return input.map(function (mongoS) { return parser(mongoS); });
    }
    return parser(input);
}
exports.parseToFront = parseToFront;
function parser(s) {
    var receipts = [];
    if (!s.receiptIds.some(function (obj) { return typeof obj === 'string'; })) {
        receipts = s.receiptIds.map(function (rec) { return Receipt_1.parseToFront(rec); });
    }
    return {
        id: s._id,
        name: s.name,
        surname: s.surname,
        dateOfBirth: s.dateOfBirth,
        fiscalCode: s.fiscalCode,
        parent: s.parent,
        phoneNumber: s.phoneNumber,
        schoolClass: s.schoolClass,
        address: s.address,
        notes: s.notes,
        receipts: receipts,
    };
}
//# sourceMappingURL=Student.js.map