"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
var fs_1 = require("fs");
var html_pdf_1 = require("html-pdf");
var path_1 = require("path");
var ejs_1 = require("ejs");
var receiptModel_1 = require("../models/receiptModel");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
function getPdf(eq, res) {
    // the path is calculated from inside the compiled folder
    res.setHeader('Content-Type', 'application/pdf');
    var fileName = 'pdf-wella.pdf';
    receiptModel_1.ReceiptModel.find()
        .then(function (receipts) {
        console.log(receipts);
        // dates have to be parsed
        (0, ejs_1.renderFile)((0, path_1.join)(__dirname, '..', '..', 'pdf-views', 'full-table.ejs'), { receipts: receipts }, function (err, file) {
            handleError(err, 'ejs');
            (0, html_pdf_1.create)(file, {
                format: 'A4',
                orientation: 'portrait',
                border: {
                    top: '50px',
                    bottom: '50px',
                },
            }).toFile(fileName, function (err, file) {
                handleError(err, 'creating');
                res.setHeader('file-name', 'mega-printout');
                res.sendFile(file.filename, function (err) {
                    handleError(err, 'sending');
                    (0, fs_1.unlinkSync)(fileName);
                });
            });
        });
    })
        .catch(function () { return (0, httpRespGenerator_1.generateHttpRes)(res, 500, 'cannot create pdf'); });
}
exports.getPdf = getPdf;
function handleError(err, msg) {
    if (err) {
        console.log('err' + msg + ': ', err);
        throw err;
    }
}
//# sourceMappingURL=pdfPrintoutController.js.map