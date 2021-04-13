import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MainPageComponent } from './main-page.component';
import { ReceiptFormComponent } from './receipt-form/receipt-form.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StudentBioComponent } from './student-bio/student-bio.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { StudentReceiptsComponent } from './student-receipts/student-receipts.component';

const routes: Routes = [{ path: '', component: MainPageComponent }];

@NgModule({
  declarations: [
    ReceiptFormComponent,
    StudentBioComponent,
    StudentFormComponent,
    StudentInfoComponent,
    StudentReceiptsComponent,
    SidebarComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    MaterialModule,
    CommonModule,
    MatSidenavModule,
  ],
})
export class MainPageModule {}
