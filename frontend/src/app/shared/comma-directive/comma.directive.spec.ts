import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { CommaDirective } from './comma.directive';

describe('CommaDirective', () => {
  let fixture: ComponentFixture<CommaTestComponent>,
    trans: TranslateService,
    directive: CommaDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommaTestComponent, CommaDirective],
      providers: [
        {
          provide: TranslateService,
          useValue: {
            currentLang: 'en',
            changeLangSub: new Subject(),
            get onLangChange() {
              return this.changeLangSub.asObservable();
            },
            use(newL: string) {
              console.log('lalal');

              this.currentLang = newL;
              this.changeLangSub.next();
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CommaTestComponent);
    trans = TestBed.inject(TranslateService);
    trans.use('en');
    directive = fixture.debugElement
      .query(By.directive(CommaDirective))
      .injector.get(CommaDirective);
    fixture.detectChanges();
  });

  fit(
    'the directive should detect the language change',
    waitForAsync(() => {
      const updateSpy = spyOn<any>(directive, 'updateInputAccordingToLang');
      trans.use('it');
      expect(updateSpy).toHaveBeenCalledTimes(2);
    })
  );
});

@Component({
  selector: '',
  template: `
    <input localeComma />
  `,
})
export class CommaTestComponent {}
