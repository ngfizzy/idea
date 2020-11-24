import {Component, OnInit} from '@angular/core';
import { slide } from './animation';

@Component({
    selector: 'ida-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
    animations: [slide]
})
export class AuthenticationComponent implements OnInit {
    loginClicked: boolean;
    signupClicked: boolean;

    constructor() {}
    ngOnInit() {

    }

    /**
     * It inserts the login component into the dom by
     * changing the loginClicked member variable to true
     *
     * @returns {void}
     */
    showLogin(): void {
        this.signupClicked = false;
        this.loginClicked = true;
    }

    /**
     * It returns the signup component into the dom by
     * assigning false to the signupClicked member variable
     *
     * @returns {void}
     */
    showSignup(): void {
        this.signupClicked = true;
        this.loginClicked = false;
    }
}
