import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PrintoutService } from 'src/app/main-page/student/printout/printout-page/printout.service';
import { devErrorHandlingAny } from '../devErrorHandler';

@Component({
  selector: 'download-placeholder',
  template: `
    <a #downloadAnchor style="display: none"></a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadPlaceholderComponent implements OnInit, OnDestroy {
  @ViewChild('downloadAnchor', { read: ElementRef })
  downloader: ElementRef<HTMLAnchorElement>;

  private sub: Subscription;

  constructor(private printServ: PrintoutService) {}

  ngOnInit(): void {
    this.sub = this.printServ.fileReady.subscribe((readyObj) => {
      this.onDownloadResponse(readyObj.file, readyObj.title);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private onDownloadResponse(blob: Blob, title: string) {
    let objUrl: string;
    try {
      objUrl = URL.createObjectURL(blob);
      this.downloader.nativeElement.href = objUrl;
      this.downloader.nativeElement.download = title;
      this.downloader.nativeElement.click();
      this.downloader.nativeElement.href = null;
      this.downloader.nativeElement.download = null;
      URL.revokeObjectURL(objUrl);
    } catch (error) {
      URL.revokeObjectURL(objUrl);
      devErrorHandlingAny(error);
    }
  }
}
