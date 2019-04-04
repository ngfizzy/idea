import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { AlertService } from '../../services/alert.service';
import { noteMoved } from './animations';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  animations: [noteMoved]
})
export class NoteComponent {
  @Input() note;
  @Output() editNote = new EventEmitter<object>();

  constructor(private noteService: NoteService, private alert: AlertService) { }

  /**
   * Emit event that triggers note editing
   *
   * @returns {void}
   */
  edit(): void {
    this.editNote.emit(this.note);
  }

  /**
   * This deletes a note using the noteService
   *
   * @returns {void}
   */
  removeNote(): void {
    this.noteService.removeNote(this.note.id)
      .subscribe(
        () => {},
        (message) => this.alert.open(message, 'Okay'),
      );
  }
}

