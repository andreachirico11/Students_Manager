import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { PasswordValidatorDirective } from '../shared/passwordValidator.directive';
import { TRANSLATE_CONFIG } from '../shared/translation-utils';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [AuthComponent, PasswordValidatorDirective],
  imports: [CommonModule, FormsModule, MaterialModule, TranslateModule.forChild(TRANSLATE_CONFIG)],
})
export class AuthModule {}
