import { ReceiptModel } from '../../models/receiptModel';
import { QueriesWithTimezone } from './queriesWithTimezone';

export class StatsMongoQueries extends QueriesWithTimezone {
  get yearTotalMonthTotalMissingTotal() {
    return ReceiptModel.aggregate().group({
      _id: null,
      yearTotal: this.sumAllAmounts(),
      monthTotal: this.sumAmountsOfThisMonth(),
      missingTotal: this.sumAmountNotPayed(),
    });
  }

  private sumAllAmounts() {
    return {
      $sum: '$amount',
    };
  }

  private sumAmountsOfThisMonth() {
    return {
      $sum: {
        $cond: [this.conditionThisMonth(), '$amount', 0],
      },
    };
  }

  private sumAmountNotPayed() {
    return {
      $sum: {
        $cond: [this.conditionNOtPayedAlready(), '$amount', 0],
      },
    };
  }

  private conditionThisMonth() {
    return {
      $eq: [
        {
          $month: { date: '$emissionDate', timezone: this.timezoneOffset },
        },
        {
          $month: new Date(),
        },
      ],
    };
  }

  private conditionNOtPayedAlready() {
    return {
      $eq: ['$paymentDate', null],
    };
  }
}
