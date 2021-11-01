import { TestBed } from '@angular/core/testing';

import { PrintoutService } from './printout.service';

describe('PrintoutService', () => {
  let service: PrintoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
