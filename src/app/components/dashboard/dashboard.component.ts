import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Note } from '../../models';
import { NoteService } from '../../services/note.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isEditorOpen = false;

  note: Note = {
    title: '',
    content: ''
  };

  notes: Array<any>;


  isUserOptionsVisible = false;

  constructor(private userService: UserService,
    private noteService: NoteService,
    private alert: AlertService) {
  }

  /**
   * Checks if notes are already loaded in memory
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.notes = this.noteService.getFetchedNotes();
    if (!this.notes.length) {
      this.noteService.fetchNotes()
        .subscribe(
          this.renderNotes.bind(this),
          this.handleNotesFetchingError.bind(this)
        );
    }
  }

  /**
   * Renders notes
   *
   * @param {object[]} notes an array of notes
   *
   * @returns {void}
   */
  renderNotes(notes: any): void {
    this.notes = notes;
  }

  handleNotesFetchingError(message: string) {
    const errorMessage = `${message}
    It might be that you have  not created any note.
    f you have, please reload your page`;
    this.alert.open(errorMessage);
  }

  /**
   * Shows users options whenever you hover over user icon
   *
   * @returns {void}
   */
  showUserOptions(): void {
    this.isUserOptionsVisible = true;
  }

  /**
   * Hides options whenever you hover over the user data
   *
   * @returns {void}
   */
  hideUserOptions(): void {
    this.isUserOptionsVisible = false;
  }

  /**
   * It logs user out
   *
   * @returns {void}
   */
  logout(): void {
    this.userService.logout();
  }

  /**
   * It opens note editor by seeting the isEditingOption variable totrue
   *
   * @returns {void}
   */
  addNewNote(): void {
    this.isEditorOpen = true;
  }

  /**
   * Closes note editor by setting the closeNoteEditor to false
   *
   * @returns {void}
   */
  closeNoteEditor(): void {
    this.isEditorOpen = false;
  }
}
