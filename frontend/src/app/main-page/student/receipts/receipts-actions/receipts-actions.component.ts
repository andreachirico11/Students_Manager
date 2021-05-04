import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IupdateOrDeleteEvent, updateOrDelete } from '../IUpdateOrDelete';

@Component({
  selector: 'receipts-actions',
  templateUrl: './receipts-actions.component.html',
  styleUrls: ['./receipts-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptsActionsComponent {
  @Input()
  public receiptId: string;

  @Output()
  updateOrDeleteEvent = new EventEmitter<IupdateOrDeleteEvent>();

  emit(type: updateOrDelete) {
    this.updateOrDeleteEvent.emit({ type, id: this.receiptId });
  }
}
