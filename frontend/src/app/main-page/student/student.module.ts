import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ReceiptsActionsComponent } from './receipts/receipts-actions/receipts-actions.component';
import { StudentReceiptsComponent } from './receipts/receipts-table.component';
import { StudentComponent } from './student.component';

@NgModule({
  declarations: [StudentComponent, StudentReceiptsComponent, ReceiptsActionsComponent],
  imports: [FormsModule, CommonModule, MaterialModule],
})
export class StudentModule {}
