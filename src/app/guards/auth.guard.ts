
import {of as observableOf,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';


import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  requestStatus: number;
  constructor(public router: Router, public userService: UserService) {
    this.handleFailure = this.handleFailure.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.getCurrentUser().pipe(
      map(this.handleSuccess),
      catchError(this.handleFailure), );

  }

  /**
   * If notes are fetched successfully, it means
   * users is authenticated
   *
   * @returns {boolean}
   */
  handleSuccess() {
    return true;
  }

  /**
   *
   * @param {number} status response status code
   *
   * @returns {Observable<boolean>}
   */
  handleFailure() {
    this.router.navigateByUrl('/auth');

    return observableOf(false);
  }
}
