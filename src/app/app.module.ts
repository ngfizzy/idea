import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NoteComponent } from './components/note/note.component';

import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';

import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './guards/token.interceptor';
import { NoteService } from './services/note.service';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PasswordResetFormComponent } from './components/password-reset-form/password-reset-form.component';
import { PasswordResetRequestFormComponent } from './components/password-reset-request-form/password-reset-request-form.component';
import { PasswordResetService } from './services/password-reset.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { TagService } from './services/tag.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    AuthenticationComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    NoteComponent,
    NoteEditorComponent,
    PasswordResetFormComponent,
    PasswordResetRequestFormComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    // still needed because some third party library still relies on it.
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'auth', component: AuthenticationComponent },
      { path: 'passwords/reset', component: PasswordResetRequestFormComponent },
      { path: 'passwords/reset/:token', component: PasswordResetFormComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    ])
  ],

  providers: [
    AuthGuard,
    AlertService,
    TagService,
    PasswordResetService,
    UserService,
    NoteService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
