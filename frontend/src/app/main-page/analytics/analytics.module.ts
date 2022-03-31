import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { TRANSLATE_CONFIG } from 'src/app/shared/translation-utils';
import { AnalyticsComponent } from './analytics.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    // RouterModule.forChild(routes),
    FormsModule,
    MaterialModule,
    HttpClientModule,
    CommonModule,
    TranslateModule.forChild(TRANSLATE_CONFIG),
  ],
})
export class AnalyticsModule {}
