import { IRequest } from '../models/interfaces/IRequests';
import { IStats } from '../models/interfaces/IStats';
import { generateHttpRes } from '../utils/httpRespGenerator';
import { Response } from 'express';
import { StatsError, StatsMessage } from '../models/messageEnums';

export function getStats(req: IRequest, res: Response) {
  // StudentModel.find()
  //   .then((allStudent) =>
  //     generateHttpRes(res, 200, StudentMessages.student_found, parseToFront(allStudent))
  //   )
  //   .catch(() => generateHttpRes(res, 404, StudentMessages.student_not_found));
  const st: IStats = {
    missingTotal: 100,
    monthTotal: 2222,
    yearTotal: 99999,
  };
  return generateHttpRes(res, 200, StatsMessage.stats_correctly_generated, st);
  return generateHttpRes(res, 500, StatsError.error_during_stats_generation);

  // TODO catch with statsErrorEnum
}

// db.collection.aggregate({
//   "$group": {
//     "_id": null,
//     "yearTotal": {
//       "$sum": "$amount"
//     },
//     "monthTotal": {
//       "$sum": {
//         "$cond": [
//           {
//             "$eq": [
//               {
//                 "$month": "$paymentDate"
//               },
//               11
//             ]
//           },
//           "$amount",
//           0
//         ]
//       }
//     }
//   }
// })
