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

  const getInputNative = () =>
    fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
  const getFormControl = () => fixture.componentInstance.form.get('test');

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

  it('after init format view value according to locale', () => {
    expect(getInputNative().value).toBe('1.34');
    trans.use('it');
    expect(getInputNative().value).toBe('1,34');
  });

  it('modify formControl value if the provided one has comma', () => {
    getInputNative().value = '1.2';
    getInputNative().dispatchEvent(new Event('input'));
    expect(getFormControl().value).toBe('1.2');
    getInputNative().value = '1,2';
    getInputNative().dispatchEvent(new Event('input'));
    expect(getFormControl().value).toBe('1.2');
  });

  afterEach(() => {
    trans.use('en');
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
    test: new FormControl('1.34'),
  });
}
