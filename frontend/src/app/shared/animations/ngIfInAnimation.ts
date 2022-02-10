import { trigger, transition, style, animate } from '@angular/animations';

export const ngIfInAnimation = trigger('ngIfInAnimation', [
  transition(':enter', [style({ opacity: 0 }), animate('1s ease-out', style({ opacity: 1 }))]),
]);
