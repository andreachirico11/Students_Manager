"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
var path_1 = require("path");
var fs_1 = require("fs");
function getPdf(eq, res) {
    // the path is calculated from inside the compiled folder
    res.setHeader('Content-Type', 'application/pdf');
    (0, fs_1.readFile)((0, path_1.join)(__dirname, '..', '..', 'pdf-views', 'html-sample.html'), function (err, file) {
        if (err) {
            console.log('E R R O R:', err);
        }
        console.log(file);
    });
    return;
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