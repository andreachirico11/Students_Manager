import { Component } from '@angular/core';
import { PrintoutService } from './printout.service';

@Component({
  selector: 'printout-page',
  templateUrl: './printout-page.component.html',
  styleUrls: ['./printout-page.component.scss'],
})
export class PrintoutPageComponent {
  constructor(private printoutService: PrintoutService) {}

  onDownloadAll() {
    this.printoutService.getPdf().subscribe();
  }
}
