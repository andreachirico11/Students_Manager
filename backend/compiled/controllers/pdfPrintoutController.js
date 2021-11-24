"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
var fs_1 = require("fs");
var html_pdf_1 = require("html-pdf");
var path_1 = require("path");
var ejs_1 = require("ejs");
function getPdf(eq, res) {
    // the path is calculated from inside the compiled folder
    res.setHeader('Content-Type', 'application/pdf');
    var fileName = 'pdf-wella.pdf';
    (0, ejs_1.renderFile)((0, path_1.join)(__dirname, '..', '..', 'pdf-views', 'ejs-sample.ejs'), { title: 'bella li' }, function (err, file) {
        handleError(err, 'ejs');
        (0, html_pdf_1.create)(file).toFile(fileName, function (err, file) {
            handleError(err, 'creating');
            res.setHeader('file-name', 'mega-printout');
            res.sendFile(file.filename, function (err) {
                handleError(err, 'sending');
                (0, fs_1.unlinkSync)(fileName);
            });
        });
    });
}
exports.getPdf = getPdf;
function handleError(err, msg) {
    if (err) {
        console.log('err' + msg + ': ', err);
        throw err;
    }
}
//# sourceMappingURL=pdfPrintoutController.js.map