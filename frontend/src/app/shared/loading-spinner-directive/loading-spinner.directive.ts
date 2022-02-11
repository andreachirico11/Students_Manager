import {
  AfterViewInit,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Directive({
  selector: '[loadingSpinner]',
})
export class LoadingSpinnerDirective {
  private componentRef: ComponentRef<SpinnerComponent>;

  @Input('loadingSpinner')
  set config(config: boolean | [boolean, ThemePalette]) {
    let isLoading: boolean, palette: ThemePalette;
    if (config instanceof Array) {
      isLoading = config[0];
      palette = config[1];
    } else {
      isLoading = config;
    }
    this.toggleSpinnerComponent(isLoading, palette);
  }

  constructor(
    private host: ViewContainerRef,
    private template: TemplateRef<any>,
    private factory: ComponentFactoryResolver
  ) {}

  private toggleSpinnerComponent(isLoading: boolean, palette?: ThemePalette) {
    if (isLoading) {
      this.host.clear();
      this.componentRef = this.host.createComponent(
        this.factory.resolveComponentFactory(SpinnerComponent)
      );
      if (palette) {
        this.componentRef.instance.palette = palette;
      }
    } else {
      if (this.componentRef) {
        this.componentRef.destroy();
      }
      this.host.createEmbeddedView(this.template);
    }
  }
}
