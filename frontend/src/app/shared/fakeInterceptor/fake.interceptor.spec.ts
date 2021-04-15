import { TestBed } from '@angular/core/testing';

import { FakeInterceptor } from './fake.interceptor';

describe('FakeInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FakeInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: FakeInterceptor = TestBed.inject(FakeInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
