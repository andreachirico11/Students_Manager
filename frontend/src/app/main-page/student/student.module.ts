import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { PaymentPipeModule } from 'src/app/shared/paymentType/payment-pipe-module.module';
import { TRANSLATE_CONFIG } from 'src/app/shared/translation-utils';
import { ReceiptsActionsComponent } from './receipts/receipts-actions/receipts-actions.component';
import { ReceiptsTableComponent } from './receipts/receipts-table.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { StudentComponent } from './student.component';

@NgModule({
  declarations: [
    StudentComponent,
    ReceiptsTableComponent,
    ReceiptsActionsComponent,
    StudentInfoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TranslateModule.forChild(TRANSLATE_CONFIG),
    PaymentPipeModule,
  ],
})
export class StudentModule {}
