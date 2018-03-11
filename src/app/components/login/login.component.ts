import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  @Input() show: boolean;
  @Output() showSignup: EventEmitter<null> = new EventEmitter();

  email = '';
  password = '';

  loginError: string;

  constructor(private userService: UserService, private router: Router) {
    this.show = false;
  }

  ngOnInit() {

  }

  /**
   * Logs in user. Redirects user to dashboard if login is successful
   */
  login() {
    this.userService.login(this.email, this.password)
      .subscribe(
        this.gotoDashboard.bind(this),
        this.handleError.bind(this),
      );
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
  handleError(errorMessage) {
    this.loginError = errorMessage;
  }


  /**
   * It emmits showSignup event
   *
   * @return {void}
   */
  signup() {
    this.showSignup.emit();
  }

}
