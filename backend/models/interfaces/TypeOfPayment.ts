const money = 'money',
  transfer = 'transfer',
  atm = 'atm';

export const PaymentTypeValues = [money, transfer, atm];

export type TypeOfPayment = typeof money | typeof transfer | typeof atm;
