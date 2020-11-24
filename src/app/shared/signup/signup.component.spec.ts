import { TestBed, async, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AlertComponent } from '../alert/alert.component';
import { AlertService } from '../../services/alert.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { User } from '../../models';
import { of, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';

describe('SignupComponent', () => {
  let fixtures: ComponentFixture<SignupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignupComponent,
        AlertComponent,
      ],
      providers: [
        AlertService,
        {
          provide: UserService,
          useValue: new class {
            signUp(user: User) {
              const {email, password, username, firstname, lastname} = user;
              const isAllFieldsFilled = email && password && firstname && lastname && username;

              if (isAllFieldsFilled) {
                return of({ user });
              }

              return throwError('could not sign up this user');
            }
          }(),
        },
        { provide: APP_BASE_HREF, useValue : '/' },
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([], { relativeLinkResolution: 'corrected' }),
      ]
    });
  }));

  beforeEach(waitForAsync(() => {
    fixtures = TestBed.createComponent(SignupComponent);
  }));

  it('should have names, emails email and passwords fields', waitForAsync(() => {
    const signupComponent: HTMLElement = fixtures.nativeElement;

    expect(signupComponent.querySelector('input[name="user.firstname"]')).toBeTruthy();
    expect(signupComponent.querySelector('input[name="user.lastname"]')).toBeTruthy();
    expect(signupComponent.querySelector('input[name="user.email"]')).toBeTruthy();
    expect(signupComponent.querySelector('input[name="user.username"]')).toBeTruthy();
    expect(signupComponent.querySelectorAll('input[type="password"]').length).toEqual(2);
  }));

  it('should have a signup button', waitForAsync(() => {
    const signupComponent: HTMLElement = fixtures.nativeElement;

    expect(signupComponent.querySelector('[type="submit"]')).toBeTruthy();
  }));

  it('should show a dialog signup successful dialog box when user successfully signup', waitForAsync(() => {
    const signupComponentInstance = fixtures.componentInstance;
    spyOn(signupComponentInstance, 'afterSignupSuccess');
    const user: User = {
      username: 'jd',
      firstname: 'john',
      lastname: 'doe',
      password: 'password',
      email: 'jd@gmail.com'
    };

    signupComponentInstance.user = user;
    fixtures.detectChanges();
    signupComponentInstance.signUp();
    fixtures.detectChanges();

    expect(signupComponentInstance.afterSignupSuccess).toHaveBeenCalledTimes(1);
  }));

  it('should show error when signup is not successful', waitForAsync(() => {
    const signupComponent: HTMLElement = fixtures.nativeElement;
    const signupComponentInstance = fixtures.componentInstance;
    signupComponent.querySelectorAll('input')
      .forEach((input) => {
        input.value = '';
      });
    fixtures.detectChanges();

    signupComponentInstance.signUp();
    fixtures.detectChanges();
    const error = signupComponent.querySelector('.error').textContent;

    expect(error).toEqual('could not sign up this user');
  }));
});

