export const AllRegExp = {
  onlyLetters: new RegExp('^[a-zA-Z]+$'),
  onlyLettersAndSpaces: new RegExp('^[a-zA-Z\\s]+$'),
  fiscalCode: new RegExp('^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$'),
  onlyNumbers: new RegExp('^[0-9]+(.[0-9]+)?$'),
  schoolClass: new RegExp('^[0-9][a-zA-Z]$'),
};
