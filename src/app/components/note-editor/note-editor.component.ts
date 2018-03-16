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
  @Input() isEditing;

  @Output() close = new EventEmitter<null>();

  constructor(private noteService: NoteService, private alert: AlertService) { }

  /**
   * It submits a note using the note service
   *
   * @returns {void}
   */
  submitNote(): void {
    if (this.isEditing) {
      this.submitEditedNote();
    } else {
      this.createNewNote();
    }
  }

  /**
   * Creates a new note
   *
   * @returns {void}
   */
  createNewNote(): void {
    this.noteService.createNote(this.note)
      .subscribe(
        (message) => this.alert.open(message, 'Ok', () => this.close.emit()),
        (errorMessage) => this.alert.open(errorMessage, 'Close'),
    );
  }

  /**
   * Submit edited note.
   *
   * @returns {void}
   */
  submitEditedNote(): void {
    this.noteService.editNote(this.note)
      .subscribe(
        (message) => this.alert.open(message, 'Okay', () => this.close.emit()),
        (message) => this.alert.open(message, 'Close'),
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
