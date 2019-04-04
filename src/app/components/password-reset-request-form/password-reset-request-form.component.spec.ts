import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PasswordResetRequestFormComponent } from './password-reset-request-form.component';
import { PasswordResetService } from '../../services/password-reset.service';
import { AlertService } from '../../services/alert.service';
import { of, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';

describe('PasswordResetRequestFormComponent', () => {
  let fixtures: ComponentFixture<PasswordResetRequestFormComponent>;

  beforeEach(async(() => {
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

  beforeEach(async(() => {
    fixtures = TestBed.createComponent(PasswordResetRequestFormComponent);
  }));

  it('should have an email field', async(() => {
    const compiledElement: HTMLElement = fixtures.nativeElement;

    expect(compiledElement.querySelector('[type="email"]')).toBeTruthy();
  }));

  it('should show a success alert if email is sent', async(() => {
    const componentInstance = fixtures.componentInstance;
    const alertService = TestBed.get(AlertService);
    spyOn(alertService, 'open');
    componentInstance.email = 'fisiwizy@gmail.com';
    fixtures.detectChanges();

    componentInstance.requestResetLink();
    fixtures.detectChanges();

    expect(alertService.open).toHaveBeenCalled();
  }));

  it('should show a success alert if email is sent', async(() => {
    const componentInstance = fixtures.componentInstance;
    const compiledElement: HTMLElement = fixtures.nativeElement;

    componentInstance.requestResetLink();
    fixtures.detectChanges();

    expect(compiledElement.querySelector('.error').textContent).toEqual('could not send reset email');
  }));
});
