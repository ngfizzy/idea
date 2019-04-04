import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, getTestBed, async } from '@angular/core/testing';

import { NoteService } from './note.service';
import { Note, NoteResponse, NotesResponse } from '../models';
import { apiBaseUrl } from '../../env';

describe('NoteService', () => {
  let noteService: NoteService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NoteService],
      imports: [HttpClientTestingModule],
    });

    injector = getTestBed();
    noteService = TestBed.get(NoteService);
    httpMock = injector.get(HttpTestingController);
  }));

  afterEach(async(() => {
    httpMock.verify();
  }));

  it('should fetch notes', async(() => {
    const notes: Note[] = [
      { title: 'first title', content: 'first content'},
      { title: 'second title', content: 'second content'},
    ];
    const notesResponse: NotesResponse = { notes };

    noteService.fetchNotes()
      .subscribe(
        (receivedNotes) => {
          expect(receivedNotes.length).toEqual(2);
          expect(receivedNotes).toEqual(notes);
          expect(noteService.getFetchedNotes()).toEqual(notes);
        });

    const request = httpMock.expectOne(`${apiBaseUrl}/notes`);

    expect(request.request.method).toEqual('GET');

    request.flush(notesResponse);
  }));

  it('can create note', async(() => {

    const note: Note =  {
      title: 'note title',
      content: 'note content',
      id: 1,
    };
    const noteResponse: NoteResponse = { note };

    noteService.createNote(note)
      .subscribe((noteId) => {
        expect(noteId).toEqual(note.id);
        expect(noteService.getFetchedNotes()).toEqual([ note ]);
      });

    const request = httpMock.expectOne(`${apiBaseUrl}/notes`);
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(note);

    request.flush(noteResponse);
  }));

  it('can edit notes', async(() => {
    const note: Note = {
      title: 'note title',
      content: 'note content',
      id: 1,
    };
    const noteResponse: NoteResponse = { note };

    noteService.editNote(note)
      .subscribe((message) => {
        expect(message).toContain('success');
        expect(noteService.getFetchedNotes()[0]).toEqual(note);
      });

    const request = httpMock.expectOne(`${apiBaseUrl}/notes/${note.id}`);

    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    expect(request.request.body.content).toEqual(noteResponse.note.content);
    expect(request.request.body.title).toEqual(noteResponse.note.title);

    request.flush(noteResponse);
  }));

  it('can delete a note', async(() => {
    noteService.removeNote(1)
      .subscribe((message) => {
        expect(message.toLowerCase()).toContain('success');
      });

      const request = httpMock.expectOne(`${apiBaseUrl}/notes/${1}`);
      expect(request.request.method).toEqual('DELETE');

      request.flush(null);
  }));
});
