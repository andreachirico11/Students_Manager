import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  const getIfBrowserIsDark = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the event', () => {
    service.isInDarkMode$.subscribe((e) => {
      if (e) {
        expect(e).toBeTrue();
      } else {
        expect(e).toBeFalse();
      }
    });
  });

  it('should get the right event according to test browser theme', () => {
    service.isInDarkMode$.subscribe((e) => {
      expect(e).toBe(getIfBrowserIsDark());
    });
  });

  it('should put the value in local storage', () => {
    if (getIfBrowserIsDark()) {
      expect(service['getFromLocalStorage']()).toBeTrue();
    } else {
      expect(service['getFromLocalStorage']()).toBeFalse();
    }
  });

  it('should add the value to local S', () => {
    service.switchMode(true);
    expect(service['getFromLocalStorage']()).toBeTrue();
  });

  it('should remove the value from local S', () => {
    service.switchMode(false);
    expect(service['getFromLocalStorage']()).toBeFalse();
  });
});
