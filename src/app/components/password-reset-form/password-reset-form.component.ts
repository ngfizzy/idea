import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



import { AlertService } from '../../services/alert.service';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-name',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.scss']
})
export class PasswordResetFormComponent implements OnInit {
  error: string;
  password: string;
  confirm: string;
  private token: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alert: AlertService,
    private passwordResetService: PasswordResetService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.token = params['token'];
    });
  }

  /**
   * It resets user password using the password reset service.
   *
   * @returns {void}
   */
  resetPassword(): void {
    if (this.isPasswordsMatch()) {
      this.passwordResetService
        .resetPassword(this.password, this.confirm, this.token)
        .subscribe({
          next: this.showSuccessAlert.bind(this),
          error: (errorMessage) => this.error = errorMessage
        });
    }
  }

  /**
   * It checks if password and confirm password are equal
   *
   * @returns {boolean} true if passwords match and false if they don't
   */
  private isPasswordsMatch() {
    if (this.password !== this.confirm) {
      this.error = 'Your password and confirmation password must match';
      return false;
    }
    return true;
  }

  /**
   * It pops up an alert
   *
   * @param {string} message success message
   */
  private showSuccessAlert(message: string) {
    this.alert
      .open(message, 'Proceed to login', () => this.router.navigateByUrl('/dashboard'));
  }
}
