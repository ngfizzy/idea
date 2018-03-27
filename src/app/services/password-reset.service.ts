import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

import { apiBaseUrl } from '../../env';

@Injectable()
export class PasswordResetService {

  constructor(private http: Http) { }

  /**
   *This sends a password reset link to user's email

   * @param {stirng} email User's email
   *
   * @returns {Observable<string>} observable of error or success message
   */
  requestPasswordResetLink(email: string): Observable<string> {
    const url = `${apiBaseUrl}/passwords/reset?email=${email}`;

    return this.http.get(url)
      .map((response: Response) => response.json().message)
      .catch(this.passwordResetErrorHandler.bind(this));
  }

  /**
   * This converts password reset error to a readable error message
   * @param {Response} response http response observable
   *
   * @return {Observable<string>}
   */
  private passwordResetErrorHandler(response: Response): Observable<string> {
    console.log('response', response);
    if (response.status === 500) {
      return Observable
        .throw('Something went wrong. Please try again after a while');
    }

    if (response.status === 401) {
      return Observable.throw('your link has expired');
    }

    const message: string = response.json().message;

    return Observable.throw(message);
  }

  /**
   * This reset password in the database
   *
   * @param {string} password new password
   * @param {string} password a new password
   * @param {string} authToken the authorization token appended to the reset link sent to the user
   *
   * @returns {Observable<string>} observable of success or error message
    */
  resetPassword(password: string, confirm: string, authToken: string) {
    const url = `${apiBaseUrl}/passwords/reset`;
    const headers = new Headers({ authorization: `Bearer ${authToken}` });

    return this.http
      .put(url, { password, confirm }, { headers })
      .map((request: Response) => request.json().message)
      .catch(this.passwordResetErrorHandler.bind(this));
  }
}
