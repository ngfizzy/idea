
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../models/user.interface';
import { apiBaseUrl } from '../../env';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  protected headers;

  constructor(private http: Http, private route: Router) {
    const authToken = localStorage.getItem('authToken');
    this.headers = new Headers({'authorization': authToken});
  }

  /**
   * User information from user information
   *
   * @param {User} userInfo object containing user information
   *
   * @returns {Observable} Observable of user
   */
  signUp(userInfo: User) {
    const url = `${apiBaseUrl}/users`;

    return this.http.post(url, userInfo)
      .map((response: Response) => response.json())
      .catch(this.handleSignupError);
  }

  /**
   * Handles signup error
   *
   * @param {Response | any} response http error response
   *
   * @returns {Observable} observable of errors
   */
  handleSignupError(response: Response | any) {
    if (response.status === 500) {
      return Observable.throw('An error occurred while trying to sign up. Please try again.');
    }

    const errors = response.json();
    const errorFields = Object.keys(errors);
    const firstError = errors[errorFields[0]];

    return Observable.throw(firstError.pop());
  }

  /**
   * Fetches current user from database, saves it to localstorage
   * as 'user'
   *
   * @returns {Observable<string| object>} observable of error message or user
   * object.
   */
  getCurrentUser(): Observable<string|object> {
    const url = `${apiBaseUrl}/users/current`;
    return this.http.get(url, { headers: this.headers })
      .map(this.saveCurrentUser.bind(this))
      .catch(this.handleAuthenticationError.bind(this));
  }

  /**
   * Get logged in user from database
   *
   * @return {object} user object
   */
  getCurrentUserFromLocalStorage(): object {
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * It saves user object to local storage
   *
   * @param {Response} response http response
   *
   * @returns {object} user object
   */
  private saveCurrentUser(response: Response) {
    const currentUser = response.json().user;
    localStorage.setItem('user', JSON.stringify(currentUser));

    return currentUser;
  }

  /**
   * It returns an authentication error message
   *
   * @returns {string} error message
   */
  private handleAuthenticationError() {
    return Observable.throw('Your session has expired, please login again.');
  }

  /**
   *
   * @param {string} email user's email
   * @param {string} password someone's email
   *
   * @returns {Promise} promise of token
   */
  login(email: string, password: string) {
    const url = `${apiBaseUrl}/auth/login`;

    return this.http.post(url, { email, password })
      .map((response: Response) => {
        const token = response.json().token;

        localStorage.setItem('authToken', `Bearer ${token}`);
        this.appendToHeaders('authorization', `Bearer ${token}`);

        return 'Welcome';
      })
      .catch(this.handleLoginError);
  }


  /**
   * This appends new header to request headers.
   *
   * @param name Name of the header to be added
   * @param value Value of the header to be added
   *
   * @returns {Headers} http headers
   */
  private appendToHeaders(name: string, value: any): Headers {
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
  handleLoginError(response: Response): Observable<string> {
    if (response.status === 500) {
      return Observable.throw('An error occured while trying to log you in. Please try again');
    }

    return Observable.throw('wrong username or password');
  }

  /**
   * It user out
   *
   * @returns {void}
   */
  logout(): void {
    localStorage.removeItem('authToken');
    location.reload();
  }
}
