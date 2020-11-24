import { TestBed, async, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PasswordResetRequestFormComponent } from './password-reset-request-form.component';

import { of, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { PasswordResetService } from '../../../services/password-reset.service';

describe('PasswordResetRequestFormComponent', () => {
  let fixtures: ComponentFixture<PasswordResetRequestFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PasswordResetRequestFormComponent,
      ],
      providers: [
        {
          provide: PasswordResetService,
          useValue: new class {
            requestPasswordResetLink(email) {
              if (email) {
                 return of('check your email for reset link');
              }

              return throwError('could not send reset email');
            }
          }(),
        },
        AlertService,
        { provide: APP_BASE_HREF, useValue: '/'}
      ],
      imports: [
        FormsModule,
        HttpClientModule,
      ],
    });
  }));

  beforeEach(waitForAsync(() => {
    fixtures = TestBed.createComponent(PasswordResetRequestFormComponent);
  }));

  it('should have an email field', waitForAsync(() => {
    const compiledElement: HTMLElement = fixtures.nativeElement;

    expect(compiledElement.querySelector('[type="email"]')).toBeTruthy();
  }));

  it('should show a success alert if email is sent', waitForAsync(() => {
    const componentInstance = fixtures.componentInstance;
    const alertService = TestBed.inject(AlertService);
    spyOn(alertService, 'open');
    componentInstance.email = 'fisiwizy@gmail.com';
    fixtures.detectChanges();

    componentInstance.requestResetLink();
    fixtures.detectChanges();

    expect(alertService.open).toHaveBeenCalled();
  }));

  it('should show a success alert if email is sent', waitForAsync(() => {
    const componentInstance = fixtures.componentInstance;
    const compiledElement: HTMLElement = fixtures.nativeElement;

    componentInstance.requestResetLink();
    fixtures.detectChanges();

    expect(compiledElement.querySelector('.error').textContent).toEqual('could not send reset email');
  }));
});
