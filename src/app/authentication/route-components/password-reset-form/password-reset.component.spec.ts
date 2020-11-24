import { TestBed, async, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { PasswordResetFormComponent } from './password-reset-form.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { PasswordResetService } from '../../../services/password-reset.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

describe('PasswordResetComponent', () => {

  let fixtures: ComponentFixture<PasswordResetFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PasswordResetFormComponent,
        AlertComponent,
      ],
      providers: [
        AlertService,
        {
          provide: PasswordResetService,
          useValue: new class {
            resetPassword(password: string, confirm: string, authToken: string) {
              if (password && confirm) {
                return of('signup successful');
              }

              return throwError('signup not successful');
            }
          }(),
        },
        { provide: APP_BASE_HREF, useValue: '/'}
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([], { relativeLinkResolution: 'corrected' }),
      ]
    });
  }));

  beforeEach(waitForAsync(() => {
    fixtures = TestBed.createComponent(PasswordResetFormComponent);
  }));


  it('should have a password and confirm password field', () => {
    const passwordResetForm: HTMLElement = fixtures.nativeElement;

    expect(passwordResetForm.querySelectorAll('[type="password"]').length).toEqual(2);
    expect(passwordResetForm.querySelector('[placeholder="confirm password"]')).toBeTruthy();
  });

  it('should pop up a success alert when password reset is successful', () => {
    const alertService = TestBed.inject(AlertService);
    const open = spyOn(alertService, 'open');
    const componentInstance = fixtures.componentInstance;
    componentInstance.password = 'pass';
    componentInstance.confirm = 'pass';
    fixtures.detectChanges();

    componentInstance.resetPassword();
    fixtures.detectChanges();
    expect(open).toHaveBeenCalled();
  });

  it('should show error message when passwords do not match', () => {
    const nativeElement: HTMLElement = fixtures.nativeElement;
    const componentInstance = fixtures.componentInstance;
    componentInstance.password = 'pass';
    componentInstance.confirm = 'unmatched';
    fixtures.detectChanges();

    componentInstance.resetPassword();
    fixtures.detectChanges();

    expect(nativeElement.querySelector('.error').textContent).toContain('password must match');
  });

  it('should show error message when password reset is not succesful', () => {
    const passwordResetForm: HTMLElement = fixtures.nativeElement;
    const componentInstance = fixtures.componentInstance;

    componentInstance.resetPassword();
    fixtures.detectChanges();
    const error = passwordResetForm.querySelector('.error');

    expect(error.textContent).toEqual('signup not successful');
  });
});
