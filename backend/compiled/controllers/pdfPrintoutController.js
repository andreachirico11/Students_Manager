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
exports.getPdf = exports.getStudentRecap = void 0;
var ejs_1 = require("ejs");
var fs_1 = require("fs");
var html_pdf_1 = require("html-pdf");
var path_1 = require("path");
var messageEnums_1 = require("../models/messageEnums");
var pdfCreationError_1 = require("../models/pdfCreationError");
var httpResWithErrorHeader_1 = require("../utils/httpResWithErrorHeader");
var receiptsMongoQueries_1 = require("../utils/receiptsMongoQueries");
var TEMPORARY_PDF_NAME = 'temp.pdf';
var fileOptions = {
    format: 'A4',
    orientation: 'portrait',
    border: {
        top: '50px',
        bottom: '50px',
    },
};
// export function getStudentRecap(req: IPdfStdRecapReq, res: Response) {
//   const queries = new ReceiptsMongoQueries(req.body);
//   queries.allReceipts
//     .then((receipts: IPdfReceipt[]) => createHtmlFile(receipts, req.body.locale))
//     .then((htmlFile) => {
//       create(htmlFile as string, fileOptions).toFile('temp.pdf', function (err, file) {
//         if (err) {
//           // return handleError(err, res, PdfMessages.err_during_pdf_creation);
//         }
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('file-name', 'mega-printout');
//         res.sendFile(file.filename, function (err) {
//           if (err) {
//             // return handleError(err, res, PdfMessages.err_pdf_sending);
//           }
//           unlinkSync('temp.pdf');
//         });
//       });
//     })
//     .catch((e) => res.status(500).json(new HttpResponse(e, e)));
// }
function getStudentRecap(req, res) {
    var queries = new receiptsMongoQueries_1.ReceiptsMongoQueries(req.body);
    queries.allReceipts
        .then(function (receipts) { return createHtmlFile(receipts, req.body.locale); })
        .then(function (htmlFile) { return createPdfFile(htmlFile); })
        .then(function (file) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('file-name', 'mega-printout');
        res.sendFile(file.filename, function (err) {
            if (err) {
                throw new pdfCreationError_1.PdfCreationErrorObj(messageEnums_1.PdfMessages.err_pdf_sending, err);
            }
            (0, fs_1.unlinkSync)(TEMPORARY_PDF_NAME);
        });
    })
        .catch(function (e) { return handleError(e, res); });
}
exports.getStudentRecap = getStudentRecap;
function createPdfFile(htmlFile) {
    return new Promise(function (res, rej) {
        (0, html_pdf_1.create)(htmlFile, fileOptions).toFile(TEMPORARY_PDF_NAME, function (err, file) {
            if (err) {
                rej(new pdfCreationError_1.PdfCreationErrorObj(messageEnums_1.PdfMessages.err_during_pdf_creation, err));
            }
            res(file);
        });
    });
}
function createHtmlFile(receipts, locale) {
    return new Promise(function (res, rej) {
        (0, ejs_1.renderFile)(getFilePathIntoPdfFolder('views', 'full-table.ejs'), {
            receipts: receipts,
            withStudentName: false,
            translations: getParsedTranslations(locale),
        }, function (err, htmlFile) {
            if (err) {
                rej(new pdfCreationError_1.PdfCreationErrorObj(messageEnums_1.PdfMessages.err_pdf_ejs, err));
            }
            res(htmlFile);
        });
    });
}
function switchQueryAccordingToParams(params) {
    // TODO
}
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
function handleError(err, res) {
    if (err) {
        console.log(err.type, err);
        return (0, httpResWithErrorHeader_1.sendErrorResponse)(res, 500, err.type);
    }
}
function getPdf(req, res) {
    // const queries = new ReceiptsMongoQueries(req.body);
    // queries.allReceipts
    //   .then((receipts: IPdfReceipt[]) => {
    //     renderFile(
    //       getFilePathIntoPdfFolder('views', 'full-table.ejs'),
    //       { receipts, withStudentName: true, translations: getParsedTranslations(req.query.locale) },
    //       function (err, htmlFile) {
    //         if (err) {
    //           return handleError(err, res, PdfMessages.err_pdf_ejs);
    //         }
    //         create(htmlFile, fileOptions).toFile('temp.pdf', function (err, file) {
    //           if (err) {
    //             return handleError(err, res, PdfMessages.err_during_pdf_creation);
    //           }
    //           res.setHeader('Content-Type', 'application/pdf');
    //           res.setHeader('file-name', 'mega-printout');
    //           res.sendFile(file.filename, function (err) {
    //             if (err) {
    //               return handleError(err, res, PdfMessages.err_pdf_sending);
    //             }
    //             unlinkSync('temp.pdf');
    //           });
    //         });
    //       }
    //     );
    //   })
    //   .catch((e) => handleError(e, res, PdfMessages.err_pdf_fetching_data));
}
exports.getPdf = getPdf;
//# sourceMappingURL=pdfPrintoutController.js.map