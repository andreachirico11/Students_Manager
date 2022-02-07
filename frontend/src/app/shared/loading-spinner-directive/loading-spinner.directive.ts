import { Directive, Input, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[loadingSpinner]',
})
export class LoadingSpinnerDirective implements OnChanges {
  @Input('loadingSpinner') set isLoading(isLoading) {
    if (isLoading) {
      this.mountSpinner();
    } else {
      this.unMountSpinner();
    }
  }

  constructor(private host: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change');

    if (changes.isLoading !== undefined) {
      if (changes.isLoading) {
        this.mountSpinner();
      } else {
        this.unMountSpinner();
      }
    }
  }

  private mountSpinner() {
    console.log('mount');
  }

  private unMountSpinner() {
    console.log('mount');
  }
}
