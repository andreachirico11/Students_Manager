import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { CommaDirective } from './comma.directive';

class fakeTranslate {
  currentLang = 'en';
  changeLangSub = new Subject();
  get onLangChange() {
    return this.changeLangSub.asObservable();
  }
  use(newL: string) {
    this.currentLang = newL;
    this.changeLangSub.next(null);
  }
}

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
          useClass: fakeTranslate,
        },
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(CommaTestComponent);
    trans = TestBed.inject(TranslateService);
    trans.use('en');
    directive = fixture.debugElement
      .query(By.directive(CommaDirective))
      .injector.get(CommaDirective);
    fixture.detectChanges();
  });

  it('the directive should detect the language change', () => {
    const updateSpy = spyOn<any>(directive, 'updateInputAccordingToLang');
    trans.use('it');
    expect(updateSpy).toHaveBeenCalled();
  });

  fit('formats input number according to locale', () => {
    (fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement).value = '1.2';
  });
});

@Component({
  selector: '',
  template: `
    <div [formGroup]="form">
      <input formControlName="test" localeComma />
    </div>
  `,
})
export class CommaTestComponent {
  form = new FormGroup({
    test: new FormControl(null),
  });
}
