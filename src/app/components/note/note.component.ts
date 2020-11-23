import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent {
  @Input() note;
  @Input() isTitleView = false;
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

