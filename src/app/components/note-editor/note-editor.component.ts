
import {distinctUntilChanged, debounceTime, map} from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Subscription,  fromEvent, Observable } from 'rxjs';

import { Note, Tag } from '../../models';
import { NoteService } from '../../services/note.service';
import { TagService } from '../../services/tag.service';


@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isClose = true;
  @Input() note: Note = {} as Note;
  @Input() isEditing: any;
  @Output() close = new EventEmitter<null>();
  @Output() updateTags = new EventEmitter<any[]>();

  @ViewChild('tagInput', { read: ElementRef }) tagInput: ElementRef;
  @ViewChild('noteBody', {read: ElementRef}) noteBody: ElementRef;
  @ViewChild('noteTitle', { read: ElementRef }) noteTitle: ElementRef;

  error: boolean;
  status = 'saved';
  isTagInputOpen = false;
  tag = ''; // new tag to add
  tags = [];
  foundTags: Tag[] = []; // results while/ searching for tags
  shouldOpenTagsDropup = false;
  tagActionText = '+';
  tagSearchListener: Subscription;
  editorListener: Subscription;
  titleListener: Subscription;

  constructor(private noteService: NoteService,
    private tagService: TagService) { }

  ngOnInit(): void {

    if (this.note.tags) {
      this.note.tags = this.note.tags.reverse();
    }

  }

  ngOnChanges() {
    const body = document.querySelector('body');

    if (!this.isClose) {
      body.style.overflowY = 'hidden';
    } else {
      body.style.overflowY = 'scroll';
    }
  }


  /**
   * It submits a note using the note service
   *
   * @returns {Subscription}
   */
  submitNote(): Subscription {
    const { title, content} = this.note;
    const canSubmit = (title && content) || content;
    if (canSubmit) {
      if (this.isEditing || this.note.id) {
        return this.submitEditedNote();
      }
      return this.createNewNote();
    } else {
      this.updateNoteErrorStatus('You cannot save only a title, please provide a body');
    }
  }

  /**
   * Creates a new note
   *
   * @returns {Subscription}
   */
  createNewNote(): Subscription {
    return this.noteService.createNote(this.note)
      .subscribe(
        (noteId) => {
          this.note.id = noteId;
          this.isEditing = true;

          this.updateNoteSavedStatus();
        },
        this.updateNoteErrorStatus.bind(this)
      );
  }

  /**
   * It opens and closes tag input box
   *
   * @return {void}
   */
  toggleTagInput(): void {
    if (this.tagSearchListener) {
      this.tagSearchListener.unsubscribe();
    }

    this.isTagInputOpen = !this.isTagInputOpen;
  }

  /**
   * It adds a tag to a note
   *
   * @return {Subscription}
   */
  addTag(): Subscription {
    this.tagInput
      .nativeElement
      .setSelectionRange(0, this.tag.length);

    if (!this.isEditing) {
      return this.createNewNote()
        .add(this.tagNote.bind(this));
    }

    this.foundTags = [];
    return this.tagNote();
  }

  /**
   * Tag list uses this to opimize tags
   * rendering when rendering using "trackBy"
   *
   * @param index Tag's Index
   * @param tag tags index
   */
  trackTagsById(index, tag): string {
    return tag ? tag.id : null;
  }

  /**
   * It adds a tag to a note
   *
   * @returns {Subscription}
   */
  private tagNote(): Subscription {
    const tagsLength = (this.note.tags || []).length;
    return this.tagService
      .tagNote(this.tag, this.note.id)
      .subscribe(
        (tags: Tag[])  => {
          if (tags && tags.length > tagsLength) {
            this.note.tags = tags.reverse();
          }
        },
        this.updateNoteErrorStatus.bind(this)
      );
  }

  /**
   * When tag input receives focus,
   * this method registers registers the
   * input a keyup event listener.
   *
   * @param {FocusEvent} event FocusEvent
   *
   * @returns {void}
   */
  createTagSearchListener(event: FocusEvent) {
    event.preventDefault();

    this.tagSearchListener = fromEvent(this.tagInput.nativeElement, 'keyup').pipe(
      debounceTime(500),
      distinctUntilChanged(), )
      .subscribe(
        (evt: KeyboardEvent) => this.performTagSearch(evt, this.tag)
      );
  }

  /**
   * It searches for tags similar to the tag
   * provided
   *
   * @param {KeyboardEvent} event Keyboard Event
   * @param {string} tag The tag to search
   *
   * @return {Subscription}
   */
  private performTagSearch(event: KeyboardEvent, tag): Subscription {
    if (event.key !== 'Enter') {
      return this.tagService.search(this.tag)
        .subscribe(
          (found) => {
            this.foundTags = found as Tag[];
            this.shouldOpenTagsDropup = this.foundTags.length > 0;
          },
          () => {
            this.foundTags = [];
          },
        );
    }
  }

  /**
   * Select a suggested tag and add
   *
   * @param {string} tag The tag suggestion selected by user
   *
   * @return void
   */
  selectSuggestedTag(tag: string): void {
    this.tag = tag;
    this.addTag();

    this.tagInput.nativeElement.focus();
  }

  closeTagsDropup() {
    this.shouldOpenTagsDropup = false;
  }

  /**
   * It removes a tag from note's tags list0
   *
   * @param {MouseEvent} event click event
   */
  removeTag(event: { target: HTMLElement }) {
    const tag = event.target
      .parentElement
      .childNodes[0]
      .nodeValue;
    const foundTag = this.tagService.findTagByName(this.note.tags, tag);

    this.tagService.removeTagFromNote(this.note.id, foundTag.id)
      .subscribe(
        (updatedTags) => { this.note.tags = updatedTags.reverse(); },
        message => this.status = message
      );
  }

  /**
   * Submit edited note.
   *
   * @returns {Subscription}
   */
  submitEditedNote(): Subscription {
    return this.noteService.editNote(this.note)
      .subscribe({
        next: this.updateNoteSavedStatus.bind(this),
        error: this.updateNoteErrorStatus.bind(this)
      });
  }

  /**
   * Updates status when note is saved
   *
   * @return {void}
   */
  updateNoteSavedStatus(): void {
    this.status = 'saved';
    this.error = false;
  }

  /**
   * Updates status when an error occurs
   *
   * @param {string} message Error message
   */
  updateNoteErrorStatus(message = 'an error occurred'): void {
    this.status = message;
    this.error = true;
  }

  /**
   * Emits custom angular close event which is used to update
   * the state of the editor stored in dashboard component.
   *
   * @param {Event} event angular events
   *
   * @returns {void}
   */
  cancel(event): void {
    const { className } = event.target;
    if (className === 'wrapper' || className === 'cancel') {
      this.close.emit();
      this.isEditing = false;
      // this.note = {} as Note;
    }
  }

  ngAfterViewInit() {
    // if (!this.isEditing) {
      this.editorListener = fromEvent(this.noteBody.nativeElement, 'keyup')
      .pipe(
        map((evt: any) => evt.target.value),
        debounceTime(500),
        distinctUntilChanged())
      .subscribe(
          (evt: KeyboardEvent) => this.submitNote()
      );


        this.titleListener = fromEvent(this.noteTitle.nativeElement, 'keyup')
          .pipe(
            map((evt: any) => evt.target.value),
            debounceTime(300),
            distinctUntilChanged())
          .subscribe((evt: KeyboardEvent) => {
            this.submitNote();
          });

    // }
  }
}
