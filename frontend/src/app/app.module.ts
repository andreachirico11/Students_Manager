import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { CanLoadGuard } from './shared/can-activate.guard';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { FakeInterceptor } from './shared/fakeInterceptor/fake.interceptor';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: 'enter',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    component: AuthComponent,
  },
  {
    path: '',
    loadChildren: () => import('./main-page/main-page.module').then((m) => m.MainPageModule),
    canLoad: [CanLoadGuard],
  },
];

@NgModule({
  declarations: [AppComponent, ConfirmationDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDialogModule,

    RouterModule.forRoot(routes),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: FakeInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
