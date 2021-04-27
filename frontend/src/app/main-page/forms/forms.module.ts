import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ReceiptsFormComponent } from './receipts-form/receipts-form.component';
import { StudentFormComponent } from './student-form/student-form.component';

const routes: Routes = [
  {
    path: 'receipt',
    component: ReceiptsFormComponent,
  },
  {
    path: 'receipt',
    component: ReceiptsFormComponent,
  },
  {
    path: 'student',
    component: StudentFormComponent,
  },
];

@NgModule({
  declarations: [ReceiptsFormComponent],
  imports: [RouterModule.forChild(routes), MaterialModule, HttpClientModule, CommonModule],
})
export class FormsModule {}
