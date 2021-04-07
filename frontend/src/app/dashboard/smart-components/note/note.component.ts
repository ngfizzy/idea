import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from '../../../services/note.service';
import { AlertService } from '../../../services/alert.service';
import { Note } from '../../../models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ida-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent {
  @Input() note;
  @Input() isTitleView = false;
  @Output() editNote = new EventEmitter<Note>();

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
    const labels =       {
      alert: 'You are about to delete a note. Are you sure you want to continue?',
      confirm: 'Yes',
      dismiss: 'No'
    };

    const actions = {
      afterConfirm: () => {
        this.noteService.removeNote(this.note.id)
          .pipe(take(1))
          .subscribe(
            () => {},
            (message) => this.alert.open(message, 'Okay'),
          );
      },
      afterClose:() => {}
    }

    this.alert.openConfirm(
      labels,
      actions
    );
  }
}

