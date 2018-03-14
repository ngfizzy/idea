import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers } from '@angular/http';

import { apiBaseUrl } from '../../env';

@Injectable()
export class NoteService {
  private status: number;

  private posts = [];

  constructor(private http: Http) {
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
        this.posts = response.json();
      const result =  {
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

}
