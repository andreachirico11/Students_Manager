import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  public mode: 'over' | 'side' = 'over';

  public get isOpened(): boolean {
    return this.mode === 'over' ? false : true;
  }

  constructor() {}

  ngOnInit(): void {
    this.changeSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.changeSize();
  }

  private changeSize() {
    if (window.innerWidth < 768) {
      this.mode = 'over';
    } else {
      this.mode = 'side';
    }
  }
}
