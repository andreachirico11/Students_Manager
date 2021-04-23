import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'receipts-actions',
  templateUrl: './receipts-actions.component.html',
  styleUrls: ['./receipts-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptsActionsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
