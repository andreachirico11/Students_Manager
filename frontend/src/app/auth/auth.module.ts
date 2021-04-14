import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordValidatorDirective } from '../shared/passwordValidator.directive';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [AuthComponent, PasswordValidatorDirective],
  imports: [CommonModule, FormsModule, MaterialModule],
})
export class AuthModule {}
