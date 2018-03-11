import { Component, Output, OnInit, EventEmitter } from '@angular/core';

import { User } from '../../models';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  @Output() showLogin: EventEmitter<null> = new EventEmitter();
  errorMessage: string;

  user: User = {
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
  };

  constructor(
    private userService: UserService,
    private alert: AlertService) {
    this.afterSignupSuccess = this.afterSignupSuccess.bind(this);
    this.handleSignupError = this.handleSignupError.bind(this);
    this.login = this.login.bind(this);
  }

  ngOnInit() {
  }

  /**
   * Signs up user
   *
   * @returns {void}
   */
  signUp(): void {
    this.userService.signUp(this.user)
      .subscribe(
        this.afterSignupSuccess,
        this.handleSignupError
      );
  }

  /**
   *
   * @param {object}user this is u
   */
  afterSignupSuccess(user) {
    const message = 'signup successful';
    const callToAction = 'Continue To Login';
    this.alert.open(message, callToAction, this.login);
  }

  handleSignupError(error) {
    this.errorMessage = error;
    const callToAction = 'Fix Problem';
  }

  /**
   * It emits the showLogin event
   *
   * @returns {void}
   */
  login(): void {
    this.showLogin.emit();
  }
}
