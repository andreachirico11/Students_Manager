import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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

export interface IupdateOrDeleteEvent {
  type: updateOrDelete;
  id: string;
}

type updateOrDelete = 'update' | 'delete';
