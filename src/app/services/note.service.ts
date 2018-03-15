import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';

import { apiBaseUrl } from '../../env';
import { Note } from '../models';

@Injectable()
export class NoteService {
  private status: number;

  private posts: Array<any>;

  constructor(private http: Http) {
    this.posts = [];
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
        this.posts = Array
          .from(response.json().notes)
          .reverse();
        const result = {
          posts: this.posts,
          status: this.status,
        };

        return result;
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
    return this.posts;
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
        this.posts.unshift(response.json().note);
        return 'Note Saved';
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
    if (response.status === 500) {
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
}
