import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/shared/utils-service/utils-service.service';
import { PrintoutService } from '../student/printout/printout-page/printout.service';

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  dateStart: Date = null;
  dateEnd: Date = null;

  get isTouchUiActivate() {
    return UtilsService.getIfTouchUiIsActivated();
  }

  get isButtonDisabled() {
    return !this.dateStart || !this.dateEnd;
  }

  constructor(private pdfService: PrintoutService, private translate: TranslateService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.pdfService
      .getAllRecs({
        locale: this.translate.currentLang,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
      })
      .subscribe();
  }
}
