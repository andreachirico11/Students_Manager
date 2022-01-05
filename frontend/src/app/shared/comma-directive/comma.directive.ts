import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[localeComma]',
})
export class CommaDirective implements OnDestroy, AfterViewInit {
  private languageSub: Subscription;

  constructor(
    private elRef: ElementRef<HTMLInputElement>,
    private transService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.languageSub = this.transService.onLangChange.subscribe(() => {
      this.updateInputAccordingToLang();
    });
    this.updateInputAccordingToLang();
  }

  // @HostListener('input')
  // public onInput() {
  //   console.log(this.elRef.nativeElement.value);
  // }

  ngOnDestroy(): void {
    this.languageSub.unsubscribe();
  }

  private updateInputAccordingToLang() {
    console.log(this.transService.currentLang);
  }
}
