import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { IAppConfig, IndexedDbService } from '../indexed-db.service';

import { ThemeService } from './theme.service';

let INDEXED_CONFIG: IAppConfig;

describe('ThemeService', () => {
  let service: ThemeService;

  const getIfBrowserIsDark = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  };

  beforeEach(() => {
    localStorage.clear();
    INDEXED_CONFIG = null;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IndexedDbService,
          useValue: {
            get isInDarkMode() {
              return of(INDEXED_CONFIG);
            },
            setDarkMode(x: boolean) {},
          },
        },
      ],
    });
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

  it(
    'should use the value in the indexed db before the local storage one',
    waitForAsync(() => {
      INDEXED_CONFIG = {
        configValue: true,
        configName: 'darkMode',
      };
      service['initialCheck']();
      service.isInDarkMode$.subscribe((e) => {
        expect(e).toBe(true);
      });
    })
  );
});
