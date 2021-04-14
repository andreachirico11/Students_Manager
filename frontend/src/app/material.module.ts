import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  exports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    MatFormFieldModule,
  ],
})
export class MaterialModule {}
