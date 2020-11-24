import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ida-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  @Input() show: boolean;
  @Output() showSignup: EventEmitter<null> = new EventEmitter();

  email = '';
  password = '';

  loginError: string;

  constructor(private userService: UserService, private router: Router) {
    this.show = false;
  }

  /**
   * Logs in user. Redirects user to dashboard if login is successful
   */
  login() {
    this.userService.login(this.email, this.password)
      .subscribe({
        next: this.gotoDashboard.bind(this),
        error: (error) => this.handleError(error),
      });
  }

  /**
   * Navigates user to dashboard login is successful
   */
  gotoDashboard() {
    this.router.navigateByUrl('dashboard');
  }

  /**
   *
   * @param {string} errorMessage error message
   */
  handleError(errorMessage: string) {
    this.loginError = errorMessage;
  }


  /**
   * It emmits showSignup event
   *
   * @return {void}
   */
  signup(): void {
    this.showSignup.emit();
  }
}
