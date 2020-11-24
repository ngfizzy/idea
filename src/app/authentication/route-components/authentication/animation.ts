import { trigger, animate, transition, style, state } from '@angular/animations';

export const slide = trigger('slide', [
  transition(':enter', [
    style({
      height: '10em',
      opacity: 0,
      transform: 'translateY(200%)'
    }),
    animate(300, style({
      opacity: 1,
      transform: 'translateX(0%)'
    }))
  ]),
  transition(':leave', [
    animate(300, style({
      opacity: 0,
      transform: 'translateY(-200%)'
    }))
  ])
]);

