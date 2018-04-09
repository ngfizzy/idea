import {animate, state,  style, query, stagger, trigger, transition} from '@angular/animations';

export const noteMoved = trigger('noteMoved', [
  transition('*<=>*', animate('500ms ease-in-out'))
]);
