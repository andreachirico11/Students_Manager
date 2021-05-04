const moneta = 'Moneta',
  bonifico = 'Bonifico',
  bancomat = 'Bancomat';

export const PaymentTypeValues = [moneta, bonifico, bancomat];

export type PaymentType = typeof moneta | typeof bonifico | typeof bancomat;
