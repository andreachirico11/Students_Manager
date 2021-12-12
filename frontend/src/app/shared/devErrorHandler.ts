import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export function devErrorHandling(e: HttpErrorResponse) {
  if (!environment.production) {
    console.warn('ERRORRRRRR');
  }
}

export function devErrorHandlingPdf(e: HttpErrorResponse) {
  if (!environment.production) {
    console.warn('ERRORRRRRR');
    console.warn(e.headers.get('err-name'));
  }
}

export function devErrorHandlingAny(e: any) {
  if (!environment.production) {
    console.warn('ERRORRRRRR');
    console.warn(e.error.message);
  }
}
