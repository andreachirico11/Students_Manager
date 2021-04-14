import { TestBed } from '@angular/core/testing';

import { PasswordValidationService } from './password-validation.service';

describe('PasswordValidationService', () => {
  let service: PasswordValidationService;
  const goodPasswords = ['aB1!', 'aB1!gfhakadfgil', 'aaaaaaaaBBBBBBBBBBB!!!!!!!!!22222'],
    badPasswords = ['aa', 'aaaaaaaaBBBBBBBBBBB22222', 'aaaaaaaaBBBBBBBBBBB!'],
    base = 'Password should contain at least one ',
    symbolErr = base + 'symbol',
    numberErr = base + 'number',
    uppercaseErr = base + 'uppercase letter',
    lowercaseErr = base + 'lowercase letter';
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect correct passwords', () => {
    goodPasswords.forEach((psw) => {
      expect(service.validatePassword(psw)).toEqual({});
    });
  });

  it('should detect uncorrect passwords', () => {
    const onlyLowercase = service.validatePassword(badPasswords[0]);
    expect(onlyLowercase.symbols).toBeTruthy();
    expect(onlyLowercase.numbers).toBeTruthy();
    expect(onlyLowercase.uppercase).toBeTruthy();
    const noSymb = service.validatePassword(badPasswords[1]);
    expect(noSymb.symbols).toBeTruthy();
    expect(noSymb.numbers).toBeFalsy();
    expect(noSymb.uppercase).toBeFalsy();
    expect(noSymb.lowercase).toBeFalsy();
    const noNum = service.validatePassword(badPasswords[2]);
    expect(noNum.symbols).toBeFalsy();
    expect(noNum.numbers).toBeTruthy();
    expect(noNum.uppercase).toBeFalsy();
    expect(noNum.lowercase).toBeFalsy();
  });

  it('get the right error text', () => {
    const errArray = service.getErrorsText({
      lowercase: true,
      uppercase: true,
      symbols: true,
      numbers: true,
    });
    expect(errArray).toContain(lowercaseErr);
    expect(errArray).toContain(uppercaseErr);
    expect(errArray).toContain(numberErr);
    expect(errArray).toContain(symbolErr);
  });
});
