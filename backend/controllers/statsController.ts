import { IStatsRequest } from '../models/interfaces/IRequests';
import { generateHttpRes } from '../utils/httpRespGenerator';
import { Response } from 'express';
import { StatsError, StatsMessage } from '../models/messageEnums';
import { StatsMongoQueries } from './mongoQueries/statsMongoQueries';

export function getStats(req: IStatsRequest, res: Response) {
  new StatsMongoQueries(parseTimezone(req.query.timezoneOffset)).yearTotalMonthTotalMissingTotal
    .then((result) => {
      return generateHttpRes(res, 200, StatsMessage.stats_correctly_generated, result[0]);
    })
    .catch(() => generateHttpRes(res, 500, StatsError.error_during_stats_generation));
}

function parseTimezone(timezone: string) {
  if (/\-/.test(timezone)) {
    return timezone;
  }
  return timezone.replace(' ', '+');
}
