import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent implements OnInit {
  @Input()
  public successBtnLabel = 'Yes';

  @Input()
  public unsuccessBtnLabel = 'No';

  @Input()
  public dialogTitle = 'Title';

  @Input()
  public onlyConfirmation: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
