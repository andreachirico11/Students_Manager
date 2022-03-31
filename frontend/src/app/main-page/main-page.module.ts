import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { AuthGuard } from '../shared/auth.guard';
import { TRANSLATE_CONFIG } from '../shared/translation-utils';
import { AnalyticsComponent } from './analytics/analytics.component';
import { FormsComponent } from './forms/forms.component';
import { MainPageComponent } from './main-page.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'analytics',
        loadChildren: () => import('./analytics/analytics.module').then((m) => m.AnalyticsModule),
        component: AnalyticsComponent,
        data: { delay: 3000 },
      },
      {
        path: ':id',
        loadChildren: () => import('./student/student.module').then((m) => m.StudentModule),
        component: StudentComponent,
        data: { delay: 1000 },
      },
      {
        path: 'compilation',
        loadChildren: () => import('./forms/forms.module').then((m) => m.FormsModule),
        component: FormsComponent,
        data: { delay: 2000 },
      },
    ],
    canActivateChild: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [MainPageComponent, SidebarComponent, FormsComponent],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    MaterialModule,
    HttpClientModule,
    CommonModule,
    TranslateModule.forChild(TRANSLATE_CONFIG),
  ],
})
export class MainPageModule {}
