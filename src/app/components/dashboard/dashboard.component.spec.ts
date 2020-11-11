import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { NoteComponent } from '../note/note.component';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { AlertComponent } from '../alert/alert.component';

import { AlertService } from '../../services/alert.service';
import { NoteService } from '../../services/note.service';
import { UserService } from '../../services/user.service';
import { TagService } from '../../services/tag.service';
import { Note, User } from '../../models';
import { of } from 'rxjs';

describe('DashbardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let userService: UserService;
  let componentInstance: DashboardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        NoteComponent,
        NoteEditorComponent,
        AlertComponent,
      ],
      providers: [
        AlertService,
        TagService,
        UserService,
        NoteService,
        { provide: APP_BASE_HREF, useValue: '/'}
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    userService = TestBed.inject(UserService);
    componentInstance   = fixture.componentInstance;
    spyOn(componentInstance, 'hashUserEmail');
    spyOn(userService, 'getCurrentUserFromLocalStorage').and.callFake(() => ({} as User));

  }));

  it('should have a main header', () => {
    const mainHeader = fixture.debugElement.query(By.css('.main-header'));

    expect(mainHeader).toBeTruthy();
  });

  it('can open note editor if add button is clicked', () => {
    fixture.detectChanges();
    const addButton = fixture.debugElement.query(By.css('.add'));
    const noteEditor = fixture.debugElement
      .query(By.css('.note-editor'));

      addButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(noteEditor.parent.properties.hidden).toBe(false);
  });

  it('should render available notes', waitForAsync(() => {
      const noteService: NoteService = TestBed.inject(NoteService);
      const notes: Note[] = [
        { title: 'first note', content: 'first content', id: 1},
        { title: 'second  note', content: 'second content', id: 2 },
        { title: 'third note', content: 'third content', id: 3}
      ];
      spyOn(noteService, 'fetchNotes').and.returnValue(of(notes));
      const debugElement = fixture.debugElement;

      fixture.detectChanges();

      expect(debugElement.queryAll(By.css('.note')).length).toEqual(notes.length);
  }));

  it('can edit a an existing note when the note is clicked', waitForAsync(() => {
    const noteService: NoteService = TestBed.inject(NoteService);
    const notes: Note[] = [
      { title: 'first note', content: 'first content', id: 1, tags: []},
    ];
    spyOn(noteService, 'fetchNotes').and.returnValue(of(notes));
    spyOn(noteService, 'removeNote').and.returnValue(of('Note Deleted Successfully'));
    fixture.detectChanges();
    const debugElement = fixture.debugElement;
    const renderedNote: HTMLElement = debugElement.nativeElement.querySelector('.body');

    renderedNote.click();
    fixture.detectChanges();

    expect(componentInstance.isEditorCreating).toEqual(false);
    expect(componentInstance.isEditorOpen).toEqual(true);
    expect(componentInstance.note).toBe(notes[0]);
  }));
});
