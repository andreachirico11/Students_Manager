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
var httpResponse_1 = require("../models/httpResponse");
var messageEnums_1 = require("../models/messageEnums");
var pdfCreationError_1 = require("../models/pdfCreationError");
var httpRespGenerator_1 = require("../utils/httpRespGenerator");
var receiptsMongoQueries_1 = require("../utils/receiptsMongoQueries");
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
//     .then((receipts: IPdfReceipt[]) => {
//       renderFile(
//         getFilePathIntoPdfFolder('views', 'full-table.ejs'),
//         { receipts, translations: getParsedTranslations(req.body.locale) },
//         function (err, htmlFile) {
//           if (err) {
//             return handleError(err, res, PdfMessages.err_pdf_ejs);
//           }
//           create(htmlFile, fileOptions).toFile('temp.pdf', function (err, file) {
//             if (err) {
//               return handleError(err, res, PdfMessages.err_during_pdf_creation);
//             }
//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('file-name', 'mega-printout');
//             res.sendFile(file.filename, function (err) {
//               if (err) {
//                 return handleError(err, res, PdfMessages.err_pdf_sending);
//               }
//               unlinkSync('temp.pdf');
//             });
//           });
//         }
//       );
//     })
//     .catch((e) => handleError(e, res, PdfMessages.err_pdf_fetching_data));
// }
function getStudentRecap(req, res) {
    var queries = new receiptsMongoQueries_1.ReceiptsMongoQueries(req.body);
    queries.allReceipts
        .then(function (receipts) { return createHtmlFile(receipts, req.body.locale); })
        .then(function (htmlFile) {
        (0, html_pdf_1.create)(htmlFile, fileOptions).toFile('temp.pdf', function (err, file) {
            if (err) {
                // return handleError(err, res, PdfMessages.err_during_pdf_creation);
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('file-name', 'mega-printout');
            res.sendFile(file.filename, function (err) {
                if (err) {
                    // return handleError(err, res, PdfMessages.err_pdf_sending);
                }
                (0, fs_1.unlinkSync)('temp.pdf');
            });
        });
    })
        .catch(function (e) { return res.status(500).json(new httpResponse_1.HttpResponse(e, e)); });
}
exports.getStudentRecap = getStudentRecap;
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
        return (0, httpRespGenerator_1.generateHttpRes)(res, 500, err.type);
    }
}
//# sourceMappingURL=pdfPrintoutController.js.map