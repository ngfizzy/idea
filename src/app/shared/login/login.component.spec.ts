import { TestBed, async, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { AlertComponent } from '../alert/alert.component';
import { AlertService } from '../../services/alert.service';
import { NoteComponent } from '../note/note.component';
import { NoteService } from '../../services/note.service';
import { APP_BASE_HREF } from '@angular/common';

describe('LoginComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        DashboardComponent,
        NoteEditorComponent,
        AlertComponent,
        NoteComponent,
      ],
      imports: [
        FormsModule,
        RouterModule.forRoot([
    { path: 'dashboard', component: DashboardComponent },
], { relativeLinkResolution: 'corrected' }),
        HttpClientModule,
      ],
      providers: [
        AlertService,
        NoteService,
        { provide: APP_BASE_HREF, useValue : '/' },
        {
          provide: UserService, useValue:  new class {
            login(email: string, password: string) {
              if (email && password) {
                return of('Welcome');
              }

              return throwError('wrong email or password');
            }
          }(),
        },
      ],
    });
  }));

  it('should have an email field', waitForAsync(() => {
    const fixtures = TestBed.createComponent(LoginComponent);
    const loginComponent: HTMLElement = fixtures.nativeElement;

    expect(loginComponent.querySelector('input[name="email"]')).toBeTruthy();
  }));

  it('should have a password field', waitForAsync(() => {
    const fixtures = TestBed.createComponent(LoginComponent);
    const loginComponent: HTMLElement = fixtures.nativeElement;

    expect(loginComponent.querySelector('input[name="password"]')).toBeTruthy();
  }));

  it('should have a login button', waitForAsync(() => {
    const fixtures = TestBed.createComponent(LoginComponent);
    const loginComponent: HTMLElement = fixtures.nativeElement;

    expect(loginComponent.querySelector('[type="submit"]').textContent.toLowerCase())
      .toContain('login');
  }));

  it('should have a reset password link', waitForAsync(() => {
    const fixtures = TestBed.createComponent(LoginComponent);
    const loginComponent: HTMLElement = fixtures.nativeElement;

    const passwordResetLink = loginComponent.
      querySelector('a[routerLink="/passwords/reset"]');

    expect(passwordResetLink.textContent.toLowerCase())
      .toContain('forgot password');
  }));

  it('should go to dashboard after successful login', waitForAsync(() => {
    const fixtures = TestBed.createComponent(LoginComponent);
    const loginComponentInstance = fixtures.componentInstance;
    spyOn(loginComponentInstance, 'gotoDashboard');
    loginComponentInstance.email = 'johndoe@gmail.com';
    loginComponentInstance.password = 'pass1234';

    loginComponentInstance.login();

    expect(loginComponentInstance.gotoDashboard).toHaveBeenCalledTimes(1);
  }));

  it('should display error message when login is not successful', waitForAsync(() => {
    const fixtures = TestBed.createComponent(LoginComponent);
    const loginComponentInstance = fixtures.componentInstance;
    const loginComponent: HTMLElement = fixtures.nativeElement;

    loginComponentInstance.login();
    fixtures.detectChanges();
    const error = loginComponent
      .querySelector('.error')
      .textContent
      .toLowerCase();

    expect(error).toEqual('wrong email or password');
  }));
});
