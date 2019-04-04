
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';

import { apiBaseUrl } from '../../env';

@Injectable()
export class PasswordResetService {

  constructor(private http: HttpClient) { }

  /**
   *This sends a password reset link to user's email

   * @param {stirng} email User's email
   *
   * @returns {Observable<string>} observable of error or success message
   */
  requestPasswordResetLink(email: string): Observable<string> {
    const url = `${apiBaseUrl}/passwords/reset?email=${email}`;

    return this.http.get(url).pipe(
      map((response: any) => response.message),
      catchError(this.passwordResetErrorHandler.bind(this)), );
  }

  /**
   * This converts password reset error to a readable error message
   * @param {HttpResponse} response http response observable
   *
   * @return {Observable<string>}
   */
  private passwordResetErrorHandler(response: any): Observable<string> {
    if (response.status === 500) {
      return observableThrowError('Something went wrong. Please try again after a while');
    }

    if (response.status === 401) {
      return observableThrowError('your link has expired');
    }

    const message: string = response.message;

    return observableThrowError(message);
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
  resetPassword(password: string, confirm: string, authToken: string): Observable<string> {
    const url = `${apiBaseUrl}/passwords/reset`;
    const headers = new HttpHeaders({ authorization: `Bearer ${authToken}` });

    return this.http
      .put(url, { password, confirm }, { headers }).pipe(
        map((request: any) => request.message),
        catchError(this.passwordResetErrorHandler.bind(this)), );
  }
}
