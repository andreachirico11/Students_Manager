import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { TRANSLATE_CONFIG } from 'src/app/shared/translation-utils';
import { FormsGuard } from './forms.guard';
import { ReceiptsFormComponent } from './receipts-form/receipts-form.component';
import { ParentFormComponent } from './student-stepper/parent-form/parent-form.component';
import { StudentFormComponent } from './student-stepper/student-form/student-form.component';
import { StudentResumeComponent } from './student-stepper/student-resume/student-resume.component';
import { StudentStepperComponent } from './student-stepper/student-stepper.component';
import { FormBaseComponent } from './utils/form-base.component';

const routes: Routes = [
  {
    path: 'receipt/add/:studentId',
    component: ReceiptsFormComponent,
    canDeactivate: [FormsGuard],
  },
  {
    path: 'receipt/:id',
    component: ReceiptsFormComponent,
    canDeactivate: [FormsGuard],
  },
  {
    path: 'student',
    component: StudentStepperComponent,
    canDeactivate: [FormsGuard],
  },
  {
    path: 'student/:id',
    component: StudentStepperComponent,
    canDeactivate: [FormsGuard],
  },
  // testing
  // { path: 'prova', component: StudentStepperComponent },
  ////////
];

@NgModule({
  declarations: [
    ParentFormComponent,
    ReceiptsFormComponent,
    StudentFormComponent,
    StudentResumeComponent,
    StudentStepperComponent,
    FormBaseComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    MaterialModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(TRANSLATE_CONFIG),
  ],
})
export class FormsModule {}
