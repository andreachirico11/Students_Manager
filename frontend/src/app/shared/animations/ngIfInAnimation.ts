import { trigger, transition, style, animate } from '@angular/animations';

export const ngIfInAnimation = trigger('ngIfInAnimation', [
  transition(':enter', [
    style({ 'margin-top': -100, opacity: 0 }),
    animate('1s ease-out', style({ 'margin-top': 0, opacity: 1 })),
  ]),
]);
