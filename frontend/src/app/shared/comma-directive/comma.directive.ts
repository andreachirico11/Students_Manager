import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[localeComma]',
})
export class CommaDirective implements OnDestroy, AfterViewInit {
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

  @HostListener('input')
  public onInput() {
    const previousVal: string = this.elRef.nativeElement.value;
    if (/[,]/.test(previousVal)) {
      this.ctrl.control.setValue(previousVal.replace(',', '.'), { emitEvent: false });
      this.elRef.nativeElement.value = previousVal;
    }
  }

  ngOnDestroy(): void {
    this.languageSub.unsubscribe();
  }

  private modifyFormatAccordingToLocale() {
    if (this.elRef.nativeElement.value) {
      this.elRef.nativeElement.value = parseFloat(this.elRef.nativeElement.value).toLocaleString(
        this.trans.currentLang
      );
    }
  }
}
