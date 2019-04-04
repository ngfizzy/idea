import { TestBed, async } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserService } from './user.service';
import { User } from '../models';
import { apiBaseUrl } from '../../env';
import { UserResponse } from '../models/server-responses/user-response.interface';

describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    });

    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  afterEach(async(() => {
    httpMock.verify();
  }));

  it('should respond with a success when signup is successful', async(() => {
    const user: User = {
      firstname: 'john',
      lastname: 'doe',
      email: 'johndoe@gmail.com',
      password: 'pass1234',
      username: 'jd',
    };

    const signupResponse: UserResponse =  { user };

    userService.signUp(user)
      .subscribe((response) => {
        expect(response).toEqual(signupResponse);
      });

    const request = httpMock.expectOne(`${apiBaseUrl}/users`);
    expect(request.request.method.toLowerCase()).toEqual('post');

    request.flush(signupResponse);
  }));

  it('should save auth token to localstorage and return success message when login is successful', async(() => {
    const email = 'johndoe@gmai.com';
    const password = 'password';
    spyOn(window.localStorage, 'setItem').and.callThrough();
    const expectedResponse = { token: 'this is my jwt token'};

    userService.login(email, password)
      .subscribe((message) => {
        expect(typeof message).toEqual('string');
        expect(message).toBeTruthy();
        expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
      });

    const request = httpMock.expectOne(`${apiBaseUrl}/auth/login`);

    expect(request.request.method.toLowerCase()).toEqual('post');
    expect(request.request.body).toEqual({email, password});

    request.flush(expectedResponse);
  }));

  it('can get current user', async(() => {

    const user: User = {
      firstname: 'john',
      lastname: 'doe',
      email: 'johndoe@gmail.com',
      username: 'jd',
    };

    const expectedUserResponse: UserResponse = { user };
    userService.getCurrentUser()
      .subscribe((userResponse) => {
        expect(userResponse as User).toEqual(user);
      });

      const request = httpMock.expectOne(`${apiBaseUrl}/users/current`);

      expect(request.request.method.toLowerCase()).toEqual('get');
      expect(request.request.headers.has('authorization')).toEqual(true);

      request.flush(expectedUserResponse);
  }));

  it('can get current user from localStorage', async(() => {
    const user: User = {
      firstname: 'john',
      lastname: 'doe',
      email: 'johndoe@gmail.com',
      username: 'jd',
    };

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));

    const fetchedUser = userService.getCurrentUserFromLocalStorage();

    expect(localStorage.getItem).toHaveBeenCalledWith('user');
    expect(fetchedUser).toEqual(user);
  }));

  // to be rewritten when the method is rewritten to use angular router to redirect
  // to login
  xit('can log out a user', () => {
    Object.defineProperty(window.location, 'reload', {
      configurable: true,
      writable: true,
      set: () =>  {}
    });
    spyOn(window.location, 'reload');
    spyOn(localStorage, 'removeItem');

    userService.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
  });
});
