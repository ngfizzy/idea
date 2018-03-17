import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Rx';


import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


import { NoteService } from '../services/note.service';
import { apiBaseUrl } from '../../env';

@Injectable()
export class AuthGuard implements CanActivate {
  requestStatus: number;
  constructor(public router: Router, public noteService: NoteService) {
    this.handleFailure = this.handleFailure.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.noteService.fetchNotes()
      .map(this.handleSuccess)
      .catch(this.handleFailure);

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
  handleFailure(status) {
    const currentUrl = `${apiBaseUrl}/${this.router.url}`;

    if (status === 401 ) {
      this.router.navigateByUrl('/auth');
      return Observable.of(false);
    }

    return Observable.of(true);
  }
}
