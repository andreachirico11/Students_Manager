import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ReceiptsActionsComponent } from './receipts/receipts-actions/receipts-actions.component';
import { ReceiptsTableComponent } from './receipts/receipts-table.component';
import { StudentComponent } from './student.component';
import { StudentInfoComponent } from './student-info/student-info.component';

@NgModule({
  declarations: [StudentComponent, ReceiptsTableComponent, ReceiptsActionsComponent, StudentInfoComponent],
  imports: [CommonModule, MaterialModule, FormsModule],
})
export class StudentModule {}
