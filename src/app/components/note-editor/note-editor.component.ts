import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../models';
import { NoteService } from '../../services/note.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css'],
})
export class NoteEditorComponent {

  @Input() isClose = true;
  @Input() note: Note;

  @Output() close = new EventEmitter<null>();

  constructor(private noteService: NoteService, private alert: AlertService) { }

  /**
   * It submits a note using the note service
   *
   * @returns {void}
   */
  submitNote(): void {
    this.noteService.createNote(this.note)
      .subscribe(
        (message) => this.alert.open(message, 'Ok'),
        (errorMessage) => this.alert.open(errorMessage, 'Close'),
    );
  }

  /**
   * Emits custom angular close event which is used to update
   * the state of the editor stored in dashboard component.
   *
   * @param {Event} event angular events
   *
   * @returns {void} Error
   */
  cancel(event): void {
    const { className } = event.target;
    if (className === 'wrapper' || className === 'cancel') {
      this.close.emit();
    }
  }
}
