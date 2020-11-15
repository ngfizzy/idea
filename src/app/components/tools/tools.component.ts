import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tools',
  template: `<div class="tools">
    <div title="toggle layout" class="tool view-toggler" (click)="toggleDashboardView()"><img [src]="viewIcon" /></div>
    <div title="add note" class="tool add" (click)="addNewNote()">+</div>

  </div>`,
  styles: [`
    .tools {
      width: 100%;
      height: fit-content;
    }
    .tool {
      margin-bottom:

      .5rem;
    }

    .tool:hover {
      box-shadow: 0 0 20px #847E89;
      opacity: 0.9;
    }

    .add {
      width: 100%;
      text-align: center;
      border-radius: 100%;
      background-color: #54426B;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      padding-left: .2rem;
      padding-right: .2rem;
      color: white;
      margin-bottom: .5rem;
      cursor: pointer;
      font-size: 1.18rem;
      font-weight: bolder;
    }

    .view-toggler {
      width: 100%;
      height: 2.8rem;
      border-radius: .8rem;
      background-color: #988aaa;
      padding: .1rem;
    }
    .view-toggler img {
      width: 100%;
      height: 100%;
      border-radius: inherit
    }

  `]
})
export class ToolsComponent implements OnInit {
  @Output() createNote = new EventEmitter();
  @Output() toggleView = new EventEmitter<boolean>();

  @Input() grid = true;

  viewIcon = 'assets/grid-view.png';



  constructor() { }

  ngOnInit() {
    this.viewIcon =
      this.grid ? 'assets/grid-view.png'
        : 'assets/labels-view.png';
  }

  addNewNote() {
    this.createNote.emit();
  }

  toggleDashboardView() {
    this.viewIcon =
    this.grid ? 'assets/grid-view.png'
      : 'assets/labels-view.png';
      this.toggleView.emit(this.grid);
  }
}
