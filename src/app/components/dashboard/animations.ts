import { animate, trigger, style, transition, state, keyframes, query, stagger } from '@angular/animations';


export const noteInOut = trigger('noteInOut', [

  transition('*<=>*',
[    query(':enter',
      stagger(200,
        animate(1000,
          keyframes([
            style({ transform: 'translateY(-100vh)', offset: 0 }),
            style({ transform: 'translateX(0)', offset: 0.3 }),
            style({ transform: 'translateY(-10%)', offset: 1 })
          ]))),
      { optional: true }
    ),
    query(':leave',
      stagger(100,
        animate(500,
          keyframes([
            style({ transform: 'translateY(-10%)', offset: 0 }),
            style({ transform: 'translateX(0)', offset: 0.7 }),
            style({ transform: 'translateY(100vh)', offset: 1 })
          ]))),
      { optional: true }
    )],
  )
]);
