import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';


import { apiBaseUrl } from '../../env';

@Injectable()
export class TagService {
    constructor(private http: HttpClient) { }

    /**
     * Get all notes belonging to a user
     *
     * @returns {Observable<string[]| string>} observable of tags or error message
     */
    getAll(): Observable<string[] | string> {
        return this.http.get(`${apiBaseUrl}/tags`)
            .map((response: Response) => response.json().notes)
            .catch(this.handleError.bind(this));
    }

    /**
     * It adds a tag to a user's note
     *
     * @param {string} tag
     * @param {number} noteId Id of the note i want to send
     *
     * @return {Observable<any[] |  string}
     */
    tagNote(tag: string, noteId: number): Observable<string[] | string> {
        return this.http
            .put(`${apiBaseUrl}/notes/tags/${noteId}`, { tag })
            .map((response: any) => response.tags)
            .catch(this.handleError.bind(this));
    }

    /**
     * Fetch tags of a note belonging to current
     * user
     *
     * @param {number} noteId Id of note to fetch
     *
     * @returns {Observable<string[]|string} tags or error message
     */
    fetchNoteTags(noteId: number) {
        return this.http.get(`${apiBaseUrl}/notes/tags/${noteId}`)
            .map((response: Response) =>
                response.json().tags)
            .catch(this.handleError.bind(this));
    }

    private handleError(response: Response) {

        switch (response.status) {
            case 404:
                return this.handleNotFoundError(response);
            default:
                return this.handleServerError();
        }
    }

    private handleNotFoundError(response: Response) {
        const contentType = response.headers
            .get('content-type')
            .toLocaleLowerCase();

        if (contentType !== 'application\\json') {
            return Observable.throw('Not Found');
        }

        return Observable.throw(response.json().message);
    }

    /**
     * Search for tags that matches a particular name
     *
     * @param {string} tag the tag you're searching for
     *
     * @returns {Observable<string | string[]>} an array of tags belonging to
     * the current user or an error message
     */
    search(tag: string) {
        return this.http.get(`${apiBaseUrl}/tags/search?query=${tag}`)
            .map((response: any) => response.tags)
            .catch(this.handleError);
    }

    /**
     * @returns {Observable<string>}
     */
    private handleServerError(): Observable<string> {
        return Observable.throw('an error occurred while trying to carry out his operation');
    }
}
