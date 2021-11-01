import { Component, ElementRef, ViewChild } from '@angular/core';
import { PrintoutService } from './printout.service';

@Component({
  selector: 'printout-page',
  templateUrl: './printout-page.component.html',
  styleUrls: ['./printout-page.component.scss'],
})
export class PrintoutPageComponent {
  @ViewChild('downloadAnchor', { read: ElementRef })
  downloader: ElementRef<HTMLAnchorElement>;

  constructor(private printoutService: PrintoutService) {}

  onDownloadAll() {
    this.printoutService.getPdf().subscribe((fileBlob) => {
      try {
        const objUrl = URL.createObjectURL(fileBlob);
        this.downloader.nativeElement.href = objUrl;
        this.downloader.nativeElement.download = 'titleee';
        this.downloader.nativeElement.click();
        this.downloader.nativeElement.href = null;
        this.downloader.nativeElement.download = null;
        URL.revokeObjectURL(objUrl);
      } catch (error) {
        console.warn('catch =>', error);
      }
    });
  }
}
