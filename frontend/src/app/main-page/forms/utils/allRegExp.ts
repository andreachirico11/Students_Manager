export const AllRegExp = (function () {
  return {
    onlyLetters: new RegExp('^[A-Za-zÀ-ÖØ-öø-ÿ]+$'),
    onlyLettersAndSpaces: new RegExp('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$'),
    onlyLettersAndSpacesAndApostrophe: new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ\\s']+$"),
    fiscalCode: new RegExp('^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$'),
    onlyNumbers: new RegExp('^[0-9]+([,.][0-9]+)?$'),
    schoolClass: new RegExp('^[0-9][a-zA-Z]$'),
  };
})();
