import { AfterViewInit, Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ngIfInAnimation } from '../animations/ngIfInAnimation';

@Component({
  selector: 'spinner',
  template: `
    <mat-spinner
      *ngIf="showSpinner"
      [color]="palette"
      [diameter]="diameter"
      @ngIfInAnimation
    ></mat-spinner>
  `,
  styleUrls: ['./spinner.component.scss'],
  animations: [ngIfInAnimation],
})
export class SpinnerComponent implements AfterViewInit {
  palette: ThemePalette = 'primary';
  diameter: number;
  showSpinner = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const width = this.el.nativeElement.offsetWidth,
      height = this.el.nativeElement.offsetHeight;
    if (width && height) {
      this.diameter = Math.floor((width > height ? height : width) / 3);
    } else {
      this.diameter = 50;
    }
    this.showSpinner = true;
  }
}
