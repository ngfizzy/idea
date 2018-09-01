import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import stringSimilarity from 'string-similarity';

import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';

import { apiBaseUrl } from '../../env';
import { Note } from '../models';

@Injectable()
export class NoteService {
  private status: number;

  private notes: Array<any>;

  constructor(private http: Http) {
    this.notes = [];
  }

  /**
   * Fetches user's notes
   *
   * @returns {Observable<any>}
   */
  fetchNotes(): Observable<any> {
    const url = `${apiBaseUrl}/notes`;
    const token = localStorage.getItem('authToken');
    const headers = new Headers({ authorization: token });

    return this.http.get(url, { headers })
      .map((response: Response) => {
        this.status = response.status;
        this.notes = Object.values(response.json().notes);

        return this.notes;
      })
      .catch((response: Response) => {
        this.status = response.status;

        return Observable.throw(this.status);
      });
  }

  /**
   * Fetched notes are stored in memory: This is a temporary mechasm
   *
   * @returns {object}
   */
  getFetchedNotes() {
    return this.notes;
  }

  /**
   * Returns request status code
   *
   * @returns {number}
   */
  getRequestStatus() {
    return this.status;
  }

  /**
   * It creates a note
   *
   * @param {Note} note a note
   *
   * @returns {Observable<any>} It returns an observable of created notes
   */
  createNote(note: Note): Observable<any> {
    const url = `${apiBaseUrl}/notes`;
    const headers =
      new Headers({ authorization: localStorage.getItem('authToken') });

    return this.http.post(url, note, { headers })
      .map((response: Response) => {
        this.notes.unshift(response.json().note);

        return this.notes[0].id;
      })
      .catch(this.handleCreateError.bind(this));
  }


  /**
   * It throws and observable of errorMessage
   *
   * @param response User
   *
   * @returns {Observable<any>} Observable of error  messsage
   */
  handleCreateError(response: Response): Observable<any> {
    if (response.status === 500 || !response.status) {
      return Observable.throw('We are sorry. An error occurred while trying to create this note');
    }

    const errorMessage = this.getCreateMessage(response.json());

    return Observable.throw(errorMessage);
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
  editNote(note: Note): Observable<any> {
    const headers = new Headers({ authorization: localStorage.getItem('authToken') });

    const { id, title, content } = note;
    const url = `${apiBaseUrl}/notes/${id}`;

    return this.http.put(url, { title, content }, { headers })
      .map(this.updateEditedNote.bind(this))
      .catch(this.handleCreateError.bind(this));
  }

  /**
   * It updates the in-memory notesearchs. This is important so that user won't have to reload the page to update the dom
   *
   * @param {Response} response http response
   *
   * @returns string
   */
  updateEditedNote(response: Response) {
    const editedNote = response.json().note;
    const indexOfNote = this.notes
      .findIndex((currentNote) => currentNote.id === editedNote.id);
    this.notes.splice(indexOfNote, 1);
    this.notes.unshift(editedNote);

    return 'Your note has been successfully updated';
  }

  /**
   * Compare titles of note with user's search and becomes
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
    const headers = new Headers({ authorization: localStorage.getItem('authToken') });
    const url = `${apiBaseUrl}/notes/search?query=${searchTerms}`;
    if (!searchTerms) {
      return this.fetchNotes();
    }
    return this.http.get(url, { headers })
      .map((response: Response) => {
        this.notes = response.json().notes;

        return this.notes;
      })
      .catch((response) => {
        switch (response.status) {
          case 404:
            return Observable.throw(response.json().message);
          case 401:
            return Observable.throw('your session has expired. Please login again');
          default:
            return Observable
              .throw('Oops :( . Something went wrong. Please try again later');
        }
      });
  }

  /**
   * This deletes a note from
   *
   * @param {number} id the id of the note to be deleted
   *
   * @returns {Observable<any>} Observable of success or error message
   */
  removeNote(id: number): Observable<any> {
    const headers = new Headers({ authorization: localStorage.getItem('authToken') });
    const url = `${apiBaseUrl}/notes/${id}`;

    return this.http.delete(url, { headers })
      .map(() => {
        const noteIndex = this.notes.findIndex(note => note.id === id);
        this.notes.splice(noteIndex, 1);

        return 'Note Deleted Successfully';
      })
      .catch(() =>
        Observable.
          throw('An Error Occured while trying to delete this note. You may reload and try again'));
  }
}
