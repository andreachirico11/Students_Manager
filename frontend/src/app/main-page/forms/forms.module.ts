import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ReceiptsFormComponent } from './receipts-form/receipts-form.component';
import { StudentBaseComponent } from './student-base/student-base.component';
import { StudentFormComponent } from './student-base/student-form/student-form.component';
import { StudentResumeComponent } from './student-base/student-resume/student-resume.component';

const routes: Routes = [
  {
    path: 'receipt/add/:studentId',
    component: ReceiptsFormComponent,
  },
  {
    path: 'receipt/:id',
    component: ReceiptsFormComponent,
  },
  {
    path: 'student',
    component: StudentBaseComponent,
  },
  {
    path: 'student/:id',
    component: StudentBaseComponent,
  },
  // testing
  { path: 'prova', component: StudentFormComponent },
  ////////
];

@NgModule({
  declarations: [ReceiptsFormComponent, StudentBaseComponent, StudentFormComponent, StudentResumeComponent],
  imports: [
    RouterModule.forChild(routes),
    MaterialModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class FormsModule {}
