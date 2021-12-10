import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { pairwise, startWith, Subscription } from 'rxjs';
import { ReceiptsColNames } from 'src/app/shared/models/receiptsColNames';
import { ReceiptsFilters } from 'src/app/shared/models/receiptsFilters';
import { IStudentPdfParas } from '../IStudentPdfParams';
import { PrintoutService } from './printout.service';

@Component({
  selector: 'printout-page',
  templateUrl: './printout-page.component.html',
  styleUrls: ['./printout-page.component.scss'],
})
export class PrintoutPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('downloadAnchor', { read: ElementRef })
  downloader: ElementRef<HTMLAnchorElement>;
  columnNames = Object.keys(ReceiptsColNames).filter((c) => c !== ReceiptsColNames._studentId);
  filters = Object.keys(ReceiptsFilters);
  showDateRange = false;
  form: FormGroup;
  filtersSub: Subscription;
  valueSub: Subscription;

  constructor(
    private printoutService: PrintoutService,
    private route: ActivatedRoute,
    private translateS: TranslateService
  ) {}

  ngOnInit() {
    this.form = this.addFilters(
      this.addOrderBy(this.addColumns(new FormGroup({}), this.columnNames))
    );
  }

  ngAfterViewInit(): void {
    this.filtersSub = this.onFiltersInputChange();
    this.valueSub = this.onValueChange();
  }

  ngOnDestroy() {
    this.filtersSub.unsubscribe();
    this.valueSub.unsubscribe();
  }

  onGenerate() {
    const { filters, orderBy, columns, dateRange } = this.form.value;
    const params: IStudentPdfParas = {
      _studentid: this.route.snapshot.parent.params.id,
      locale: this.translateS.currentLang,
      columns: this.getActiveColumns({ ...columns }),
    };
    if (filters) {
      params.filters = filters;
      if (filters.find((f) => f === ReceiptsFilters.dateRange)) {
        params.dateRange = dateRange;
      }
    }
    if (orderBy) {
      params.orderBy = orderBy;
    }
    this.printoutService.getStudentRecsPdf(params).subscribe();
  }

  private addColumns(f: FormGroup, columnNames: string[]) {
    f.addControl('columns', new FormGroup({}));
    columnNames.forEach((colName) => {
      (f.get('columns') as FormGroup).addControl(colName, new FormControl(true));
    });
    return f;
  }

  private addFilters(f: FormGroup): FormGroup {
    f.addControl('filters', new FormControl([]));
    return f;
  }

  private addOrderBy(f: FormGroup): FormGroup {
    f.addControl('orderBy', new FormControl(null));
    return f;
  }

  private onFiltersInputChange(): Subscription {
    const filtersField = this.form.get('filters');
    return filtersField.valueChanges.pipe(startWith([]), pairwise()).subscribe(([prev, actual]) => {
      const verifyForNewValue = this.hasANewValue(prev, actual),
        filtersCtrl = this.form.get('filters');
      if (verifyForNewValue(ReceiptsFilters.dateRange)) {
        this.removeValuesFromCtrl(filtersCtrl, ReceiptsFilters.thisMonth, ReceiptsFilters.thisYear);
      } else if (verifyForNewValue(ReceiptsFilters.thisMonth)) {
        this.removeValuesFromCtrl(filtersCtrl, ReceiptsFilters.thisYear, ReceiptsFilters.dateRange);
      } else if (verifyForNewValue(ReceiptsFilters.thisYear)) {
        this.removeValuesFromCtrl(
          filtersCtrl,
          ReceiptsFilters.thisMonth,
          ReceiptsFilters.dateRange
        );
      } else if (verifyForNewValue(ReceiptsFilters.isPayed)) {
        this.removeValuesFromCtrl(filtersCtrl, ReceiptsFilters.notPayed);
      } else if (verifyForNewValue(ReceiptsFilters.notPayed)) {
        this.removeValuesFromCtrl(filtersCtrl, ReceiptsFilters.isPayed);
      }
    });
  }

  private onValueChange(): Subscription {
    return this.form.get('filters').valueChanges.subscribe((newVal: string[]) => {
      if (newVal.find((v) => v === ReceiptsFilters.dateRange)) {
        this.addDateRangeGroup(this.form);
      } else {
        this.removeDateRangeGroup(this.form);
      }
    });
  }

  private hasANewValue(prev: string[], next: string[]): Function {
    return (requiredVal: ReceiptsFilters): boolean =>
      prev.findIndex((f) => f === requiredVal) < 0 && next.findIndex((f) => f === requiredVal) >= 0;
  }

  private removeValuesFromCtrl(ctrl: AbstractControl, ...values: string[]) {
    ctrl.setValue((ctrl.value as string[]).filter((vl) => !values.includes(vl)));
  }

  private addDateRangeGroup(f: FormGroup) {
    f.addControl(
      'dateRange',
      new FormGroup({
        startDate: new FormControl(null, Validators.required),
        endDate: new FormControl(null, Validators.required),
      }),
      { emitEvent: false }
    );
    this.showDateRange = true;
  }

  private removeDateRangeGroup(f: FormGroup) {
    this.showDateRange = false;
    f.removeControl('dateRange', { emitEvent: false });
  }

  private getActiveColumns(columnObj: Object): string[] {
    return Object.keys(columnObj).filter((key) => columnObj[key]);
  }
}

// onDownloadAll() {
//   this.printoutService.getPdf().subscribe((resp) => {
//     try {
//       const objUrl = URL.createObjectURL(resp.file);
//       this.downloader.nativeElement.href = objUrl;
//       this.downloader.nativeElement.download = resp.title;
//       this.downloader.nativeElement.click();
//       this.downloader.nativeElement.href = null;
//       this.downloader.nativeElement.download = null;
//       URL.revokeObjectURL(objUrl);
//     } catch (error) {
//       console.warn('catch =>', error);
//     }
//   });
// }
