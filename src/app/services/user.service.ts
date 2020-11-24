
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { User } from '../models/user.interface';
import { apiBaseUrl } from '../../env';
import { Router } from '@angular/router';
import { UserResponse } from '../models/server-responses/user-response.interface';

@Injectable()
export class UserService {
  protected headers;

  constructor(private http: HttpClient, private route: Router) {
    // passing undefined as an header causes error. hence we pass empty string.
    const authToken = localStorage.getItem('authToken') || '';
    this.headers = new HttpHeaders({'authorization': authToken});
  }

  /**
   * User information from user information
   *
   * @param {User} userInfo object containing user information
   *
   * @returns {Observable<UserResponse | string} Observable of user
   */
  signUp(userInfo: User): Observable<UserResponse | string> {
    const url = `${apiBaseUrl}/users`;

    return this.http.post(url, userInfo, {observe: 'response'}).pipe(
      map((response: HttpResponse<UserResponse>) => response.body),
      catchError(this.handleSignupError));
  }

  /**
   * Handles signup error
   *
   * @param {Response | any} response http error response
   *
   * @returns {Observable} observable of errors
   */
  handleSignupError(response: HttpResponse<any>) {
    if (response.status === 500) {
      return observableThrowError('An error occurred while trying to sign up. Please try again.');
    }

    const errors = response;
    const errorFields = Object.keys(errors);
    const firstError = errors[errorFields[0]];

    return observableThrowError(firstError.pop());
  }

  /**
   * Fetches current user from database, saves it to localstorage
   * as 'user'
   *
   * @returns {Observable<string| User>} observable of error message or user
   * object.
   */
  getCurrentUser(): Observable<string | User | {}> {
    const url = `${apiBaseUrl}/users/current`;
    return this.http.get<UserResponse>(url, { headers: this.headers, observe: 'response' }).pipe(
      map(this.saveCurrentUser.bind(this)),
      catchError(this.handleAuthenticationError.bind(this)), );
  }

  /**
   * Get logged in user from database
   *
   * @return {User} user object
   */
  getCurrentUserFromLocalStorage(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * It saves user object to local storage
   *
   * @param {Response} response http response
   *
   * @returns {object} user object
   */
  private saveCurrentUser(response: HttpResponse<UserResponse>): User {
    const currentUser = response.body.user;
    localStorage.setItem('user', JSON.stringify(currentUser));

    return currentUser;
  }

  /**
   * It returns an authentication error message
   *
   * @returns {Observable<string>} error message
   */
  private handleAuthenticationError(): Observable<string> {
    return observableThrowError('Your session has expired, please login again.');
  }

  /**
   *
   * @param {string} email user's email
   * @param {string} password someone's email
   *
   * @returns {Observable<<string>} promise of token
   */
  login(email: string, password: string): Observable<string> {
    const url = `${apiBaseUrl}/auth/login`;
    const loginInfo = {email, password};

    return this.http.post(url, loginInfo, {observe: 'response'}).pipe(
      map((response: HttpResponse<{token: string}>) => {
        const token = response.body.token;

        localStorage.setItem('authToken', `Bearer ${token}`);
        this.appendToHeaders('authorization', `Bearer ${token}`);

        return 'Welcome';
      }),
      catchError(this.handleLoginError), );
  }


  /**
   * This appends new header to request headers.
   *
   * @param name Name of the header to be added
   * @param value Value of the header to be added
   *
   * @returns {HttpHeaders} http headers
   */
  private appendToHeaders(name: string, value: any): HttpHeaders {
    this.headers.set(name, value);

    return this.headers;
  }

  /**
   * Handles login error
   *
   * @param {Response} response http response
   *
   * @returns {Observable} observable of error message
   */
  handleLoginError(response: any): Observable<string> {
    if (response.status === 500) {
      return observableThrowError('An error occured while trying to log you in. Please try again');
    }

    return observableThrowError('wrong username or password');
  }

  /**
   * It logs user out
   *
   * @returns {void}
   */
  logout(): void {
    localStorage.removeItem('authToken');
    this.route.navigate(['/auth']);
  }
}
