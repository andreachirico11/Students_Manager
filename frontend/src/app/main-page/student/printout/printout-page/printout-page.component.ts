import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReceiptsColNames } from 'src/app/shared/models/receiptsColNames';
import { ReceiptsFilters } from 'src/app/shared/models/receiptsFilters';
import { PrintoutService } from './printout.service';

@Component({
  selector: 'printout-page',
  templateUrl: './printout-page.component.html',
  styleUrls: ['./printout-page.component.scss'],
})
export class PrintoutPageComponent implements OnInit {
  @ViewChild('downloadAnchor', { read: ElementRef })
  downloader: ElementRef<HTMLAnchorElement>;
  columnNames = Object.keys(ReceiptsColNames).filter((c) => c !== ReceiptsColNames._studentId);
  filters = Object.keys(ReceiptsFilters);

  form: FormGroup;

  constructor(private printoutService: PrintoutService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = this.addFilters(
      this.addOrderBy(this.addColumns(this.buildForm(), this.columnNames))
    );
    console.log(this.route.snapshot);
    this.route.paramMap.subscribe((r) => {
      console.log(r);
    });
  }

  onDownloadAll() {
    this.printoutService.getPdf().subscribe((resp) => {
      try {
        const objUrl = URL.createObjectURL(resp.file);
        this.downloader.nativeElement.href = objUrl;
        this.downloader.nativeElement.download = resp.title;
        this.downloader.nativeElement.click();
        this.downloader.nativeElement.href = null;
        this.downloader.nativeElement.download = null;
        URL.revokeObjectURL(objUrl);
      } catch (error) {
        console.warn('catch =>', error);
      }
    });
  }

  onGenerate() {
    this.printoutService;
  }

  private buildForm(): FormGroup {
    const f = new FormGroup({
      columns: new FormGroup({}),
    });
    return f;
  }

  private addColumns(f: FormGroup, columnNames: string[]) {
    columnNames.forEach((colName) => {
      (f.get('columns') as FormGroup).addControl(colName, new FormControl(true));
    });
    return f;
  }

  private addFilters(f: FormGroup): FormGroup {
    f.addControl('filters', new FormControl(null));
    return f;
  }

  private addOrderBy(f: FormGroup): FormGroup {
    f.addControl('orderBy', new FormControl(null));
    return f;
  }
}
