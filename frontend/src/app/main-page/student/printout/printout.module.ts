import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { TRANSLATE_CONFIG } from 'src/app/shared/translation-utils';
import { PrintoutPageComponent } from './printout-page/printout-page.component';

@NgModule({
  declarations: [PrintoutPageComponent],
  imports: [CommonModule, MaterialModule, TranslateModule.forChild(TRANSLATE_CONFIG)],
})
export class PrintoutModule {}
