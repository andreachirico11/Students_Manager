import { IRequest } from '../models/interfaces/IRequests';
import { IStats } from '../models/interfaces/IStats';
import { generateHttpRes } from '../utils/httpRespGenerator';
import { Response } from 'express';
import { StatsError, StatsMessage } from '../models/messageEnums';
import { ReceiptModel } from '../models/receiptModel';

export function getStats(req: IRequest, res: Response) {
  ReceiptModel.aggregate()
    .group({
      _id: null,
      yearTotal: {
        $sum: '$amount',
      },
      monthTotal: {
        $sum: {
          $cond: [
            {
              $eq: [
                {
                  $month: '$paymentDate',
                },
                {
                  $month: new Date(),
                },
              ],
            },
            '$amount',
            0,
          ],
        },
      },
      missingTotal: {
        $sum: {
          $cond: [
            {
              $eq: ['$paymentDate', null],
            },
            '$amount',
            0,
          ],
        },
      },
    })
    .then((result) => {
      return generateHttpRes(res, 200, StatsMessage.stats_correctly_generated, result[0]);
    })
    .catch(() => generateHttpRes(res, 500, StatsError.error_during_stats_generation));
}
