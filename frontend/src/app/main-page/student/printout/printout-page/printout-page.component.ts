import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { pairwise, startWith, Subscription } from 'rxjs';
import { devErrorHandlingAny } from 'src/app/shared/devErrorHandler';
import { ReceiptsColNames } from 'src/app/shared/models/receiptsColNames';
import { ReceiptsFilters } from 'src/app/shared/models/receiptsFilters';
import { UtilsService } from 'src/app/shared/utils-service/utils-service.service';
import { atLeastOneCol } from '../atLeastOneCol.validator';
import { IStudentPdfReqBody } from '../IStudentPdfReqBody';
import { PrintoutService } from './printout.service';

@Component({
  selector: 'printout-page',
  templateUrl: './printout-page.component.html',
  styleUrls: ['./printout-page.component.scss'],
})
export class PrintoutPageComponent implements OnInit, OnDestroy, AfterViewInit {
  columnNames = Object.keys(ReceiptsColNames).filter((c) => c !== ReceiptsColNames._studentId);
  filters = Object.keys(ReceiptsFilters);
  showDateRange = false;
  form: FormGroup;

  get isTouchUiActivate() {
    return UtilsService.getIfTouchUiIsActivated();
  }

  private filtersSub: Subscription;
  private transSub: Subscription;

  constructor(
    private printoutService: PrintoutService,
    private route: ActivatedRoute,
    private dateAd: DateAdapter<any>,
    private translateS: TranslateService,
    private location: Location
  ) {}

  ngOnInit() {
    this.dateAd.setLocale(this.translateS.currentLang);
    this.transSub = this.translateS.onLangChange.subscribe((ev) => {
      this.dateAd.setLocale(ev.lang);
    });
    this.form = this.generateForm();
  }

  ngAfterViewInit(): void {
    this.filtersSub = this.onFiltersInputChange();
  }

  ngOnDestroy() {
    this.filtersSub.unsubscribe();
    this.transSub.unsubscribe();
  }

  onGenerate() {
    this.printoutService.getStudentRecsPdf(this.parseFormValueIntoParams()).subscribe((r) => {
      if (r) {
        this.location.back();
      }
    });
  }

  onBlankReceipt() {
    this.printoutService.getBlankReceipt(this.route.snapshot.parent.params.id).subscribe((r) => {
      if (r) {
        this.location.back();
      }
    });
  }

  private generateForm(): FormGroup {
    const f = new FormGroup({});
    f.addControl('columns', new FormGroup({}, atLeastOneCol));
    this.columnNames.forEach((colName) => {
      (f.get('columns') as FormGroup).addControl(colName, new FormControl(true));
    });
    f.addControl('filters', new FormControl([]));
    f.addControl('orderBy', new FormControl(null));
    f.addControl('ascending', new FormControl(true));
    f.addControl('withTotal', new FormControl(true));
    return f;
  }

  private onFiltersInputChange(): Subscription {
    const filtersCtrl = this.form.get('filters');
    return filtersCtrl.valueChanges.pipe(startWith([]), pairwise()).subscribe(([prev, actual]) => {
      const verifyForNewValue = this.hasANewValue(prev, actual);
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
      this.checkFiltersForDateRange(filtersCtrl);
    });
  }

  private parseFormValueIntoParams(): IStudentPdfReqBody {
    const { filters, orderBy, columns, dateRange, ascending, withTotal } = this.form.value;
    const params: IStudentPdfReqBody = {
      _studentId: this.route.snapshot.parent.params.id,
      locale: this.translateS.currentLang,
      columns: this.getActiveColumns({ ...columns }),
      ascending,
      withTotal,
    };
    if (filters.length > 0) {
      params.filters = filters;
      if (filters.find((f) => f === ReceiptsFilters.dateRange)) {
        params.dateRange = dateRange;
      }
    }
    if (orderBy) {
      params.orderBy = orderBy;
    }
    return params;
  }

  private checkFiltersForDateRange(ctr: AbstractControl) {
    if (ctr.value.find((v) => v === ReceiptsFilters.dateRange)) {
      this.addDateRangeGroup(this.form);
    } else {
      this.removeDateRangeGroup(this.form);
    }
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
