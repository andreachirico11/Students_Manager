import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
    path: 'receipt/:id',
    component: ReceiptsFormComponent,
  },
  {
    path: 'student',
    component: StudentFormComponent,
  },
  {
    path: 'student/:id',
    component: StudentFormComponent,
  },
];

@NgModule({
  declarations: [ReceiptsFormComponent],
  imports: [
    RouterModule.forChild(routes),
    MaterialModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class FormsModule {}
