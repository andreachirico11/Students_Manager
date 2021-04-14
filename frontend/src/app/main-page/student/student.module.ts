import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { StudentComponent } from './student.component';

@NgModule({
  declarations: [StudentComponent],
  imports: [FormsModule, CommonModule, MaterialModule],
})
export class StudentModule {}
