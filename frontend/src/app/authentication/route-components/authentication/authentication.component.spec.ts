import { TestBed, async, waitForAsync } from '@angular/core/testing';
import { AuthenticationComponent } from './authentication.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { APP_BASE_HREF } from '@angular/common';
import { LoginComponent } from '../../smart-components/login/login.component';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SignupComponent } from '../../smart-components/signup/signup.component';

describe('AuthenticationComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthenticationComponent,
        LoginComponent,
        SignupComponent,
        AlertComponent,
      ],
      providers: [
        UserService,
        AlertService,
        { provide: APP_BASE_HREF, useValue : '/' },
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([], { relativeLinkResolution: 'corrected' }),
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  }));

  it('should contain a main header and a subheading', waitForAsync(() => {
    const fixtures = TestBed.createComponent(AuthenticationComponent);
    const authComponent: HTMLElement = fixtures.nativeElement;

    fixtures.detectChanges();

    expect(authComponent.querySelector('.heading').textContent).toContain('Idea');
    expect(authComponent.querySelector('.subheading').textContent).toBeTruthy();
  }));

  it('should contain a login button and signup', waitForAsync(() => {
    const fixtures = TestBed.createComponent(AuthenticationComponent);
    const authComponent: HTMLElement = fixtures.nativeElement;

    fixtures.detectChanges();

    expect(authComponent.querySelector('.btn-signup').textContent.toLowerCase()).toContain('sign up');
    expect(authComponent.querySelector('.btn-login').textContent.toLowerCase()).toContain('login');
  }));

  it('should should show login form when login button is clicked', waitForAsync(() => {
    const fixtures = TestBed.createComponent(AuthenticationComponent);
    const authComponent: HTMLElement = fixtures.nativeElement;
    const componentInstance = fixtures.componentInstance;

    componentInstance.showLogin();
    fixtures.detectChanges();

    expect(authComponent.querySelector('ida-login')).toBeTruthy();
  }));

  it('should show signup form when signup button is clicked', waitForAsync(() => {
    const fixtures = TestBed.createComponent(AuthenticationComponent);
    const componentInstance = fixtures.componentInstance;
    const authComponent: HTMLElement = fixtures.nativeElement;

    componentInstance.showSignup();
    fixtures.detectChanges();

    expect(authComponent.querySelector('ida-signup')).toBeTruthy();
  }));
});
