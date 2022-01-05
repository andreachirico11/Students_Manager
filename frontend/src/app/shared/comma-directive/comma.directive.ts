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
    private transService: TranslateService,
    private ctrl: NgControl
  ) {}

  ngAfterViewInit(): void {
    this.languageSub = this.transService.onLangChange.subscribe(() => {
      this.updateInputAccordingToLang();
    });
    this.updateInputAccordingToLang();
  }

  @HostListener('input')
  public onInput() {
    this.updateInputAccordingToLang();
  }

  ngOnDestroy(): void {
    this.languageSub.unsubscribe();
  }

  private updateInputAccordingToLang() {
    this.elRef.nativeElement.innerHTML = 'abc';
  }
}
