import { TestBed } from '@angular/core/testing';

import { TimezoneHelperService } from './timezone-helper.service';

describe('TimezoneHelperService', () => {
  let service: TimezoneHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimezoneHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the current timezone', () => {
    expect(service.parseToGmt(-540)).toBe('+09:00');
    expect(service.parseToGmt(300)).toBe('-05:00');
    expect(service.parseToGmt(60 * 25)).toBe('-01:00');
  });
});
