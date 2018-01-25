import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css'],
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
        console.log('called');
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
