"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var receiptsMongoQueries_1 = require("./mongoQueries/receiptsMongoQueries");
var studentstsMongoQueries_1 = require("./mongoQueries/studentstsMongoQueries");
var TEMPORARY_PDF_NAME = 'temp.pdf';
var fileOptions = {
    format: 'A4',
    orientation: 'portrait',
    border: {
        top: '50px',
        bottom: '50px',
    },
};
function getStudentRecap(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var student, receipts, htmlFile, file, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, new studentstsMongoQueries_1.StudentMongoQueries().studentById(req.body._studentId)];
                case 1:
                    student = (_a.sent());
                    return [4 /*yield*/, switchQueryAccordingToParams(req.body)];
                case 2:
                    receipts = _a.sent();
                    return [4 /*yield*/, createHtmlFile(receipts, req.body, student)];
                case 3:
                    htmlFile = (_a.sent());
                    return [4 /*yield*/, createPdfFile(htmlFile)];
                case 4:
                    file = (_a.sent());
                    return [4 /*yield*/, sendFile(res, file, 'mega_title')];
                case 5:
                    _a.sent();
                    (0, fs_1.unlinkSync)(TEMPORARY_PDF_NAME);
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    handleError(e_1, res);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.getStudentRecap = getStudentRecap;
function createHtmlFile(receipts, params, student) {
    return new Promise(function (res, rej) {
        (0, ejs_1.renderFile)(getFilePathIntoPdfFolder('views', 'full-table.ejs'), {
            receipts: receipts,
            withStudentName: false,
            translations: getParsedTranslations(params.locale),
            student: student,
            params: params,
        }, function (err, htmlFile) {
            if (err) {
                rej(new pdfCreationError_1.PdfCreationErrorObj(messageEnums_1.PdfMessages.err_pdf_ejs, err));
            }
            res(htmlFile);
        });
    });
}
function switchQueryAccordingToParams(params) {
    return __awaiter(this, void 0, void 0, function () {
        var queries;
        return __generator(this, function (_a) {
            queries = new receiptsMongoQueries_1.ReceiptsMongoQueries();
            // if (params.filters && params.dateRange && params.orderBy) {
            //   // TODO
            // } else if (params.filters && params.dateRange && !params.orderBy) {
            //   // TODO
            // } else if (params.filters && !params.dateRange && params.orderBy) {
            //   // TODO
            // } else if (!params.filters && !params.dateRange && params.orderBy) {
            //   // TODO
            // } else if (params.filters && !params.dateRange && !params.orderBy) {
            //   // TODO
            // } else {
            return [2 /*return*/, queries.allReceiptsForStudent(params)];
        });
    });
}
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
function sendFile(res, file, title) {
    return new Promise(function (resolve, rej) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('file-name', title);
        res.sendFile(file.filename, function (err) {
            if (err) {
                rej(new pdfCreationError_1.PdfCreationErrorObj(messageEnums_1.PdfMessages.err_pdf_sending, err));
            }
            resolve(null);
        });
    });
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
        console.log('\n\n\n\n\n\n');
        console.log(err.type);
        console.log(err);
        return (0, httpResWithErrorHeader_1.sendErrorResponse)(res, 500, err.type);
    }
}
function getPdf(req, res) { }
exports.getPdf = getPdf;
//# sourceMappingURL=pdfPrintoutController.js.map