import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/utils-service/utils-service.service';
import { PrintoutService } from '../student/printout/printout-page/printout.service';

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  dateStart: Date = null;
  dateEnd: Date = null;
  removeIfWithoutNumber = true;
  removeIfWithNumber = false;

  get isTouchUiActivate() {
    return UtilsService.getIfTouchUiIsActivated();
  }

  get isButtonDisabled() {
    return !this.dateStart || !this.dateEnd;
  }

  private transSub: Subscription;

  constructor(
    private pdfService: PrintoutService,
    private translate: TranslateService,
    private dateAd: DateAdapter<any>
  ) {}

  ngOnInit(): void {
    this.dateAd.setLocale(this.translate.currentLang);
    this.transSub = this.translate.onLangChange.subscribe((ev) => {
      this.dateAd.setLocale(ev.lang);
    });
  }

  ngOnDestroy(): void {
    this.transSub.unsubscribe();
  }

  onSubmit() {
    this.pdfService
      .getAllRecs({
        locale: this.translate.currentLang,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        removeIfWithoutNumber: this.removeIfWithoutNumber,
        removeIfWithNumber: this.removeIfWithNumber,
      })
      .subscribe();
  }
}
