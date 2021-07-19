import { TestBed } from '@angular/core/testing';
import { getFakeStudents } from '../fakeInterceptor/fakeDb';

import { ObjectComparatorService } from './object-comparator.service';

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
  });
});
