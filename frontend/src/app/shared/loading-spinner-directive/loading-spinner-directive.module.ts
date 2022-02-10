import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LoadingSpinnerDirective } from './loading-spinner.directive';

@NgModule({
  declarations: [LoadingSpinnerDirective, SpinnerComponent],
  imports: [MatProgressSpinnerModule],
  exports: [LoadingSpinnerDirective],
})
export class LoadingSpinnerModule {}
