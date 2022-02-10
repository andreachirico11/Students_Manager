import { Component, HostBinding, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'spinner',
  template: `
    <mat-spinner [color]="palette"></mat-spinner>
  `,
})
export class SpinnerComponent implements OnInit {
  palette: ThemePalette = 'primary';

  constructor() {}

  ngOnInit(): void {}
}
