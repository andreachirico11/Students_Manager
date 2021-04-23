import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatExpansionModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
})
export class MaterialModule {}
