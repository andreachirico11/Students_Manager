"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
var path_1 = require("path");
function getPdf(eq, res) {
    res.setHeader('Content-Type', 'application/pdf');
    // the path is calculated from inside the compiled folder
    res.sendFile((0, path_1.join)(__dirname, '..', '..', 'pdf-views', 'pdf-sample.pdf'), function (err) {
        if (err) {
            console.log('err: ', err);
        }
        else {
            console.log('success');
        }
    });
}
exports.getPdf = getPdf;
//# sourceMappingURL=pdfPrintoutController.js.map