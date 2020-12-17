import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '../../../models';

@Component({
  selector: 'ida-tag',
  template: `
  <div
    class="pointer tag"
    [ngClass]="overrideClass? !!overrideClass : ''"
    [class.selected]="isSelected"
    (click)="selectTag()"
  >
    <span class="icon" [title]="tag.name"></span>
    <span *ngIf="showName">{{tag.name}}</span>
  </div>`,
  styles: [`
    .tag {
      color: #fff;
      border-bottom-right-radius: 10rem;
      border-top-right-radius: 10rem;
      padding: .5rem;
    }

    .tag.selected {
      background-color: #0892a5;
    }

    .tag .icon {
      background-color: #efc69b;
      display: inline-block;
      vertical-align: middle;
      margin-right: .5rem;
      width: 2rem;
      height: 1rem;
      border-top-right-radius: 10rem;
      border-bottom-right-radius: 10rem;
      border: 1px solid;
    }
  `]
})
export class TagComponent implements OnInit {
  @Input() showName: boolean;
  @Input() tag: Tag;
  @Input() overrideClass: string;
  @Input() isSelected: boolean;

  @Output() selected = new EventEmitter<Tag>();


  constructor() { }

  ngOnInit() {
  }

  selectTag() {
    this.selected.emit(this.tag);
  }
}
