import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
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
export class PrintoutPageComponent implements OnInit, OnDestroy {
  @ViewChild('downloadAnchor', { read: ElementRef })
  downloader: ElementRef<HTMLAnchorElement>;
  columnNames = Object.keys(ReceiptsColNames).filter((c) => c !== ReceiptsColNames._studentId);
  filters = Object.keys(ReceiptsFilters);
  showDateRange = false;
  form: FormGroup;
  filtersSub: Subscription;

  constructor(
    private printoutService: PrintoutService,
    private route: ActivatedRoute,
    private translateS: TranslateService
  ) {}

  ngOnInit() {
    this.form = this.addFilters(
      this.addOrderBy(this.addColumns(new FormGroup({}), this.columnNames))
    );
    this.filtersSub = this.onFiltersInputChange();
  }

  ngOnDestroy() {
    this.filtersSub.unsubscribe();
  }

  onGenerate() {
    const { filters, orderBy, columns } = this.form.value;
    const params: IStudentPdfParas = {
      _studentid: this.route.snapshot.parent.params.id,
      filters,
      orderBy,
      locale: this.translateS.currentLang,
      columns: this.getActiveColumns({ ...columns }),
    };
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
    f.addControl('filters', new FormControl(null));
    return f;
  }

  private addOrderBy(f: FormGroup): FormGroup {
    f.addControl('orderBy', new FormControl(null));
    return f;
  }

  private onFiltersInputChange(): Subscription {
    const filtersField = this.form.get('filters');
    return filtersField.valueChanges
      .pipe(startWith(null), pairwise())
      .subscribe(([prev, actal]) => {
        const actualHasFilter = this.filterChecker(actal);
        if (!prev) {
          if (actualHasFilter(ReceiptsFilters.dateRange)) {
            this.addDateRangeGroup(this.form);
          }
          return;
        }
        const prevHasFilter = this.filterChecker(prev);
        if (
          prevHasFilter(ReceiptsFilters.dateRange) &&
          !actualHasFilter(ReceiptsFilters.dateRange)
        ) {
          this.removeDateRangeGroup(this.form);
        } else if (
          actualHasFilter(ReceiptsFilters.dateRange) &&
          (!prev || !prevHasFilter(ReceiptsFilters.dateRange))
        ) {
          this.removeValuesFromCtrl(
            filtersField,
            ReceiptsFilters.thisMonth,
            ReceiptsFilters.thisYear
          );
          this.addDateRangeGroup(this.form);
        } else if (
          actualHasFilter(ReceiptsFilters.thisMonth) &&
          (prevHasFilter(ReceiptsFilters.thisYear) || prevHasFilter(ReceiptsFilters.dateRange))
        ) {
          this.removeValuesFromCtrl(
            filtersField,
            ReceiptsFilters.thisYear,
            ReceiptsFilters.dateRange
          );
          if (prevHasFilter(ReceiptsFilters.dateRange)) {
            this.removeDateRangeGroup(this.form);
          }
        } else if (
          actualHasFilter(ReceiptsFilters.thisYear) &&
          (prevHasFilter(ReceiptsFilters.thisMonth) || prevHasFilter(ReceiptsFilters.dateRange))
        ) {
          this.removeValuesFromCtrl(
            filtersField,
            ReceiptsFilters.thisMonth,
            ReceiptsFilters.dateRange
          );
          if (prevHasFilter(ReceiptsFilters.dateRange)) {
            this.removeDateRangeGroup(this.form);
          }
        }
        this.form.updateValueAndValidity();
      });
  }

  private filterChecker(val: string[]): Function {
    return (required: ReceiptsFilters): boolean => val.findIndex((f) => f === required) >= 0;
  }

  private removeValuesFromCtrl(ctrl: AbstractControl, ...values: string[]) {
    values.forEach((v) => {
      ctrl.setValue(
        (ctrl.value as string[]).filter((vl) => vl !== v),
        { emitEvent: false }
      );
    });
  }

  private addDateRangeGroup(f: FormGroup) {
    f.addControl(
      'dateRange',
      new FormGroup({
        startDate: new FormControl(null),
        endDate: new FormControl(null),
      })
    );
    setTimeout(() => {
      f.get('dateRange.startDate').setValidators([
        Validators.required,
        Validators.max(f.get('dateRange.endDate').value),
      ]);
      f.get('dateRange.endDate').setValidators([
        Validators.required,
        Validators.min(f.get('dateRange.startDate').value),
      ]);
    });
    this.showDateRange = true;
  }

  private removeDateRangeGroup(f: FormGroup) {
    this.showDateRange = false;
    f.removeControl('dateRange');
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
