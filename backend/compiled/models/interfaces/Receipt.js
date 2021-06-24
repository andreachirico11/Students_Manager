"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToFront = void 0;
function parseToFront(r) {
    if (Array.isArray(r)) {
        return r.map(function (rec) { return parse(rec); });
    }
    return parse(r);
}
exports.parseToFront = parseToFront;
function parse(r) {
    return {
        amount: r.amount,
        emissionDate: r.emissionDate,
        id: r._id,
        number: r.number,
        paymentDate: r.paymentDate,
        typeOfPayment: r.typeOfPayment,
    };
}
//# sourceMappingURL=Receipt.js.map