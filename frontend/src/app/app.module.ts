import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { StudentInfoComponent } from './components/student-info/student-info.component';
import { StudentBioComponent } from './components/student-bio/student-bio.component';
import { StudentReceiptsComponent } from './components/student-receipts/student-receipts.component';
import { ReceiptFormComponent } from './components/receipt-form/receipt-form.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginFormComponent,
    StudentInfoComponent,
    StudentBioComponent,
    StudentReceiptsComponent,
    ReceiptFormComponent,
    StudentFormComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
