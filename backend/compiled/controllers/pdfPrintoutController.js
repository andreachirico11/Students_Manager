"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
var ejs_1 = require("ejs");
var fs_1 = require("fs");
var html_pdf_1 = require("html-pdf");
var path_1 = require("path");
var messageEnums_1 = require("../models/messageEnums");
var receiptModel_1 = require("../models/receiptModel");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
function getPdf(req, res) {
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
        (0, ejs_1.renderFile)(getFilePathIntoPdfFolder('views', 'full-table.ejs'), { receipts: receipts, withStudentName: true, translations: getParsedTranslations(req.query.locale) }, function (err, htmlFile) {
            if (err) {
                return handleError(err, res, messageEnums_1.PdfMessages.err_pdf_ejs);
            }
            (0, html_pdf_1.create)(htmlFile, {
                format: 'A4',
                orientation: 'portrait',
                border: {
                    top: '50px',
                    bottom: '50px',
                },
            }).toFile('temp.pdf', function (err, file) {
                if (err) {
                    return handleError(err, res, messageEnums_1.PdfMessages.err_during_pdf_creation);
                }
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('file-name', 'mega-printout');
                res.sendFile(file.filename, function (err) {
                    if (err) {
                        return handleError(err, res, messageEnums_1.PdfMessages.err_pdf_sending);
                    }
                    (0, fs_1.unlinkSync)('temp.pdf');
                });
            });
        });
    })
        .catch(function (e) { return handleError(e, res, messageEnums_1.PdfMessages.err_pdf_fetching_data); });
}
exports.getPdf = getPdf;
function getFilePathIntoPdfFolder() {
    var fileNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fileNames[_i] = arguments[_i];
    }
    return path_1.join.apply(void 0, __spreadArray([__dirname, '..', '..', 'pdf'], fileNames, false));
}
function getParsedTranslations(locale) {
    return JSON.parse((0, fs_1.readFileSync)(getFilePathIntoPdfFolder('translations', (locale || 'en') + '.json'), 'utf8'));
}
function handleError(err, res, message) {
    if (err) {
        console.log(message);
        return (0, httpRespGenerator_1.generateHttpRes)(res, 500, message);
    }
}
//# sourceMappingURL=pdfPrintoutController.js.map