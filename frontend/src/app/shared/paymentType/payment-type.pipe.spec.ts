import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PaymentTypePipe } from './payment-type.pipe';

const fakeValues = {
  MONEY: 'Money',
  ATM: 'Atm',
  TRANSFER: 'Transfer',
};

class fakeTranslate {
  get() {
    return of(fakeValues);
  }
}

const getPipe = () => {
  const pipe = new PaymentTypePipe(new fakeTranslate() as unknown as TranslateService);
  pipe['payments'] = {
    MONEY: 'Money',
    ATM: 'Atm',
    TRANSFER: 'Transfer',
  };
  return pipe;
};

describe('PaymentTypePipe', () => {
  it('create an instance', () => {
    const pipe = getPipe();
    expect(pipe).toBeTruthy();
  });

  it('get the right value', () => {
    const pipe = getPipe();
    expect(pipe.transform('atm')).toBe('Atm');
    expect(pipe.transform('money')).toBe('Money');
  });

  it('get empty if input is empty', () => {
    const pipe = getPipe();
    expect(pipe.transform('' as any)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform(null)).toBe('');
  });
});
