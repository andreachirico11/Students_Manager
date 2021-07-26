export const AllRegExp = {
  onlyLettersReg: new RegExp('^[a-zA-Z]+$'),
  cfReg: new RegExp('^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$'),
  onlyNumbersReg: new RegExp('^[0-9]+(.[0-9]+)?$'),
  schoolClassReg: new RegExp('^[0-9][a-zA-Z]$'),
};
