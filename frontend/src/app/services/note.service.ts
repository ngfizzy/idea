
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';


import stringSimilarity from 'string-similarity';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { apiBaseUrl } from '../../env';
import { Note, NoteResponse, NotesResponse } from '../models';

@Injectable()
export class NoteService {
  private status: number;

  private notes: Note[];

  constructor(private http: HttpClient) {
    this.notes = [];
  }

  /**
   * Fetches user's notes
   *
   * @returns {Observable<Note[]>}
   */
  fetchNotes(): Observable<Note[]> {
    const url = `${apiBaseUrl}/notes`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ authorization: token });

    return this.http.get<NotesResponse>(url, { headers, observe: 'response' }).pipe(
      map((response: HttpResponse<NotesResponse>) => {
        // this.status = response.status;
        this.notes = Object.values(response.body.notes);

        return this.notes;
      }),
      catchError((response: HttpResponse<NoteResponse>) => {
        this.status = response.status;

        return observableThrowError(this.status);
      }), );
  }

  /**
   * Fetched notes are stored in memory: This is a temporary mechasm
   *
   * @returns {Note[]}
   */
  getFetchedNotes(): Note[] {
    return this.notes;
  }

  /**
   * Returns request status code
   *
   * @returns {number}
   */
  getRequestStatus(): number {
    return this.status;
  }

  /**
   * It creates a note
   *
   * @param {Note} note a note
   *
   * @returns {Observable<any>} It returns an observable of created note's id
   */
  createNote(note: Note): Observable<number> {
    const url = `${apiBaseUrl}/notes`;
    const headers = new HttpHeaders({ authorization: localStorage.
      getItem('authToken') });

    return this.http.post<NoteResponse>(url, note, {
        headers,
        observe: 'response'
      }).pipe(
      map((response: HttpResponse<NoteResponse>) => {
        this.notes.unshift(response.body.note);

        return this.notes[0].id;
      }),
      catchError(this.handleCreateError.bind(this)), );
  }


  /**
   * It throws and observable of errorMessage
   *
   * @param response User
   *
   * @returns {Observable<any>} Observable of error  messsage
   */
  handleCreateError(response: HttpResponse<any>): Observable<string> {
    if (response.status === 500 || !response.status) {
      return observableThrowError('We are sorry. An error occurred while trying to create this note');
    }

    const errorMessage = this.getCreateMessage(response.body);

    return observableThrowError(errorMessage);
  }

  /**
   * It extract error message from error object
   *
   * @param {object} errors error object
   *
   * @returns {string} last error message on the list of error messages
   */
  private getCreateMessage(errors) {
    const fields = Object.keys(errors);
    return errors[fields.shift()].pop();
  }

  /**
   * Edits a note
   *
   * @param note Note to be edited
   */
  editNote(note: Note): Observable<string> | Observable<{}> {
    const headers = new HttpHeaders({ authorization: localStorage.getItem('authToken') });

    const { id, title, content } = note;
    const url = `${apiBaseUrl}/notes/${id}`;

    return this.http.put<NoteResponse>(url, { title, content }, { headers, observe: 'response' }).pipe(
      map(this.updateEditedNote.bind(this)),
      catchError(this.handleCreateError.bind(this)), );
  }

  /**
   * It updates the in-memory notesearchs. This is important so that user won't have to reload the page to update the dom
   *
   * @param {Response} response http response
   *
   * @returns string
   */
  updateEditedNote(response: HttpResponse<NoteResponse>) {
    const editedNote = response.body.note;
    const indexOfNote = this.notes
      .findIndex((currentNote) => currentNote.id === editedNote.id);
    this.notes.splice(indexOfNote, 1);
    this.notes.unshift(editedNote);

    return 'Your note has been successfully updated';
  }

  /**
   * Compare titles of note with user's search andnote becomes
   * returns all best matched notes
   *
   * @param {string} searchTerms string typed in by user
   */
  searchByTitleNotesInMemory(searchTerms: string): Note[] {
    return this.notes
      .filter((note) => {
        const similarities = stringSimilarity.compareTwoStrings
          (note.title, searchTerms);
        if (similarities > 0.3) {
          return true;
        }

        return false;
      });
  }

  /**
   * It searches notes by their titles
   *
   * @param {string} searchTerms Words to search for in the title
   *
   * @returns {Observable<any>} observable of notes array
   */
  searchNotesByTitle(searchTerms: string): Observable<any> {
    const headers = new HttpHeaders({ authorization: localStorage.getItem('authToken') });
    const url = `${apiBaseUrl}/notes/search?query=${searchTerms}`;
    if (!searchTerms) {
      return this.fetchNotes();
    }
    return this.http.get(url, { headers }).pipe(
      map((response: any) => {
        this.notes = response.notes;

        return this.notes;
      }),
      catchError((response) => {
        switch (response.status) {
          case 404:
            return observableThrowError(response.json().message);
          case 401:
            return observableThrowError('your session has expired. Please login again');
          default:
            return observableThrowError('Oops :( . Something went wrong. Please try again later');
        }
      }), );
  }

  /**
   * This deletes a note from
   *
   * @param {number} id the id of the note to be deleted
   *
   * @returns {Observable<any>} Observable of success or error message
   */
  removeNote(id: number): Observable<string> {
    const headers = new HttpHeaders({ authorization: localStorage.getItem('authToken') });
    const url = `${apiBaseUrl}/notes/${id}`;

    return this.http.delete(url, { headers }).pipe(
      map(() => {
        const noteIndex = this.notes.findIndex(note => note.id === id);
        this.notes.splice(noteIndex, 1);

        return 'Note Deleted Successfully';
      }),
      catchError(() =>
        observableThrowError('An Error Occured while trying to delete this note. You may reload and try again')), );
  }
}
