import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/utils-service/utils-service.service';

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  get isTouchUiActivate() {
    return UtilsService.getIfTouchUiIsActivated();
  }

  constructor() {}

  ngOnInit(): void {}
}
