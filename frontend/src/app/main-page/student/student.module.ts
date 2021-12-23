import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { PaymentPipeModule } from 'src/app/shared/paymentType/payment-pipe-module.module';
import { TRANSLATE_CONFIG } from 'src/app/shared/translation-utils';
import { PrintoutPageComponent } from './printout/printout-page/printout-page.component';
import { ReceiptsActionsComponent } from './receipts/receipts-actions/receipts-actions.component';
import { ReceiptsTableComponent } from './receipts/receipts-table.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { StudentComponent } from './student.component';

const routes: Routes = [
  {
    path: 'printout',
    loadChildren: () => import('./printout/printout.module').then((m) => m.PrintoutModule),
    component: PrintoutPageComponent,
    data: { delay: 3000 },
  },
];

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
    RouterModule.forChild(routes),
  ],
})
export class StudentModule {}
