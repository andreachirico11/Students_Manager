"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
// export function postReceipt(req: IBackendRequest<IReceipt>, res: Response) {
//   let receiptToSend: IReceipt;
//   ReceiptModelBuilder(req.body, req.params.studentId)
//     .then((receipt) => {
//       if (receipt) {
//         receiptToSend = receipt;
//         return StudentModel.updateOne(
//           { _id: req.params.studentId },
//           { $push: { receiptIds: receipt._id } }
//         );
//       }
//       throw new Error();
//     })
//     .then(() => generateHttpRes(res, 200, ReceiptMessages.receipt_created, receiptToSend))
//     .catch((err) => generateHttpRes(res, 500, ServerMessages.creation_error));
// }
function getPdf(eq, res) {
    console.log('getting pdf');
    // modify using path package
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(__dirname + '/pdf-views/pdf-sample.pdf', function (err) {
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