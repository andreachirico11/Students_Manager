import { TestBed } from '@angular/core/testing';
import { getFakeStudents } from '../fakeInterceptor/fakeDb';
import { ObjectComparatorService } from './object-comparator.service';

const stud1 = {
    name: 'primo',
    surname: 'primi',
    parent: {
      name: 'padre',
      surname: 'padri',
      phoneNumber: 0,
      fiscalCode: null,
      address: null,
    },
    receipts: [],
    dateOfBirth: '2021-07-11T22:00:00.000Z',
    phoneNumber: 0,
    fiscalCode: null,
    schoolClass: null,
    address: null,
    notes: '',
    id: '60fedd5892d0714954a2ab57',
  },
  stud2 = {
    name: 'primo',
    surname: 'primi',
    parent: {
      name: 'padre',
      surname: 'padri',
      phoneNumber: 0,
      fiscalCode: null,
      address: null,
    },
    receipts: [],
    dateOfBirth: null,
    phoneNumber: 0,
    fiscalCode: null,
    schoolClass: null,
    address: null,
    notes: '',
    id: '60fedd5892d0714954a2ab57',
  },
  stud3 = {
    name: 'primo',
    surname: 'primi',
    parent: {
      name: 'padre',
      surname: 'padri',
      phoneNumber: null,
      fiscalCode: null,
      address: 'abcde',
    },
    receipts: [],
    dateOfBirth: null,
    phoneNumber: null,
    fiscalCode: 'chrndr94m11c621q',
    schoolClass: null,
    address: 'abcde',
    notes: '',
    id: '60fedd5892d0714954a2ab57',
  },
  stud4 = {
    name: 'primo',
    surname: 'primi',
    parent: {
      name: 'padre',
      surname: 'padri',
      phoneNumber: 0,
      fiscalCode: null,
      address: 'abcde',
    },
    receipts: [],
    dateOfBirth: null,
    phoneNumber: null,
    fiscalCode: 'chrndr94m11c621q',
    schoolClass: null,
    address: 'abcde',
    notes: '',
    id: '60fedd5892d0714954a2ab57',
  };

describe('ObjectComparatorService', () => {
  let service: ObjectComparatorService;
  const fakeDb = getFakeStudents();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectComparatorService);
  });

  it('it can compare 2 objects', () => {
    expect(service.areObjEquals({}, {})).toBeTruthy('empty obs');
    expect(service.areObjEquals(fakeDb[0], {})).toBeFalsy('fill obj and empty obj');
    expect(service.areObjEquals(fakeDb[0], fakeDb[0])).toBeTruthy('same obj');
    expect(service.areObjEquals({ ...fakeDb[0] }, { ...fakeDb[0] })).toBeTruthy('same obs copied');
    expect(service.areObjEquals({ ...fakeDb[0] }, { ...fakeDb[0], name: 'carlo' })).toBeFalsy(
      'same obs copied'
    );
    expect(service.areObjEquals(stud1, stud2)).toBeFalse();
    expect(service.areObjEquals(stud1, { ...stud2, phoneNumber: null })).toBeFalse();
    expect(service.areObjEquals(stud3, stud4)).toBeFalse();
  });
});
