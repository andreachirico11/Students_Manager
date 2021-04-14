import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MainPageComponent } from './main-page.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import('./student/student.module').then((m) => m.StudentModule),
        component: StudentComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [MainPageComponent, SidebarComponent],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    MaterialModule,
    HttpClientModule,
    CommonModule,
  ],
})
export class MainPageModule {}
