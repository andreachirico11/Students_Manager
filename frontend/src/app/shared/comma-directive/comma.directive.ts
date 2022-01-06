import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[localeComma]',
})
export class CommaDirective implements AfterViewInit, OnDestroy {
  private languageSub: Subscription;

  constructor(
    private elRef: ElementRef<HTMLInputElement>,
    private ctrl: NgControl,
    private trans: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.languageSub = this.trans.onLangChange.subscribe(() => {
      this.modifyFormatAccordingToLocale();
    });
    this.modifyFormatAccordingToLocale();
  }

  ngOnDestroy(): void {
    this.languageSub.unsubscribe();
  }

  @HostListener('input')
  public onInput() {
    const previousVal: string = this.elRef.nativeElement.value;
    if (/[,]/.test(previousVal)) {
      this.ctrl.control.setValue(previousVal.replace(',', '.'), { emitEvent: false });
      this.elRef.nativeElement.value = previousVal;
    }
  }

  private modifyFormatAccordingToLocale() {
    if (this.ctrl.value) {
      const localizedSeparator = (1.1).toLocaleString(this.trans.currentLang).split('')[1];
      this.elRef.nativeElement.value = this.ctrl.value.toString().replace('.', localizedSeparator);
    }
  }
}
