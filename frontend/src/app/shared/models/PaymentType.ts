const money = 'money',
  transfer = 'transfer',
  atm = 'atm';

export const PaymentTypeValues = [money, transfer, atm];

export type PaymentType = typeof money | typeof transfer | typeof atm;
