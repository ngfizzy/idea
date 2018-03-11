
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Rx';

import { Injectable } from '@angular/core';
import { Http, Request, Response, Headers } from '@angular/http';

import { User } from '../models/user.interface';
import { apiBaseUrl } from '../../env';

@Injectable()
export class UserService {
  constructor(private http: Http) { }

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
      .map((response: Response) => {
        const post = response.json();

        return post;
      })
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

        localStorage.setItem('authToken', response.json().token);

        return 'Welcome';
      })
      .catch(this.handleLoginError);
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
}
