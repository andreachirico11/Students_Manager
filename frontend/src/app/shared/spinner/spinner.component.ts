import { AfterViewInit, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'spinner',
  template: `
    <mat-spinner [color]="palette" [diameter]="diameter"></mat-spinner>
  `,
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements AfterViewInit {
  palette: ThemePalette = 'primary';
  diameter: number = 50;

  constructor(private el: ElementRef, private changeDet: ChangeDetectorRef) {
    this.changeDet.detach();
  }

  ngAfterViewInit(): void {
    const width = this.el.nativeElement.offsetWidth,
      height = this.el.nativeElement.offsetHeight;
    if (width && height) {
      this.diameter = Math.floor((width > height ? height : width) / 4);
    }
    this.changeDet.detectChanges();
  }
}
