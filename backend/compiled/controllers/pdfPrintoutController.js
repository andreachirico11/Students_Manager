"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
var ejs_1 = require("ejs");
var fs_1 = require("fs");
var html_pdf_1 = require("html-pdf");
var path_1 = require("path");
var messageEnums_1 = require("../models/messageEnums");
var receiptModel_1 = require("../models/receiptModel");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
function getPdf(eq, res) {
    // the path is calculated from inside the compiled folder
    res.setHeader('Content-Type', 'application/pdf');
    var fileName = 'pdf-wella.pdf';
    receiptModel_1.ReceiptModel.aggregate([
        {
            $lookup: {
                from: 'students',
                localField: '_studentId',
                foreignField: '_id',
                as: 'studentInfo',
            },
        },
        {
            $unwind: '$studentInfo',
        },
        {
            $addFields: {
                studentName: {
                    $concat: ['$studentInfo.name', ' ', '$studentInfo.surname'],
                },
                paymentDateString: {
                    $dateToString: { format: '%d %m %Y', date: '$paymentDate' },
                },
                emissionDateString: {
                    $dateToString: { format: '%d %m %Y', date: '$emissionDate' },
                },
            },
        },
    ])
        .then(function (receipts) {
        (0, ejs_1.renderFile)((0, path_1.join)(__dirname, '..', '..', 'pdf-views', 'full-table.ejs'), { receipts: receipts, withStudentName: true }, function (err, file) {
            handleError(err, res, messageEnums_1.PdfMessages.err_pdf_ejs);
            (0, html_pdf_1.create)(file, {
                format: 'A4',
                orientation: 'portrait',
                border: {
                    top: '50px',
                    bottom: '50px',
                },
            }).toFile(fileName, function (err, file) {
                handleError(err, res, messageEnums_1.PdfMessages.err_during_pdf_creation);
                res.setHeader('file-name', 'mega-printout');
                res.sendFile(file.filename, function (err) {
                    handleError(err, res, messageEnums_1.PdfMessages.err_pdf_sending);
                    (0, fs_1.unlinkSync)(fileName);
                });
            });
        });
    })
        .catch(function (e) { return handleError(e, res, messageEnums_1.PdfMessages.err_pdf_fetching_data); });
}
exports.getPdf = getPdf;
function handleError(err, res, message) {
    if (err) {
        return (0, httpRespGenerator_1.generateHttpRes)(res, 500, message);
    }
}
//# sourceMappingURL=pdfPrintoutController.js.map