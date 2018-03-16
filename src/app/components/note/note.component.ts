import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export default class NoteComponent {

  @Input() note;
  @Output() editNote = new EventEmitter<object>();

  /**
   * Emit event that triggers note editing
   *
   * @returns {void}
   */
  edit(): void {
    this.editNote.emit(this.note);
  }
}
