import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AlertComponent } from './shared/alert/alert.component';
import { AuthenticationComponent } from './shared/authentication/authentication.component';
import { LoginComponent } from './shared/login/login.component';
import { SignupComponent } from './shared/signup/signup.component';

import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './guards/token.interceptor';
import { NoteService } from './services/note.service';

import { HashLocationStrategy, LocationStrategy, APP_BASE_HREF } from '@angular/common';
import { PasswordResetFormComponent } from './shared/password-reset-form/password-reset-form.component';
import { PasswordResetRequestFormComponent } from './shared/password-reset-request-form/password-reset-request-form.component';
import { PasswordResetService } from './services/password-reset.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TagService } from './services/tag.service';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    AuthenticationComponent,
    LoginComponent,
    SignupComponent,
    PasswordResetFormComponent,
    PasswordResetRequestFormComponent,
  ],
  imports: [
    DashboardModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'auth', component: AuthenticationComponent },
    { path: 'passwords/reset', component: PasswordResetRequestFormComponent },
    { path: 'passwords/reset/:token', component: PasswordResetFormComponent },
    { path: 'dashboard',
      loadChildren: () =>
      import('./dashboard/dashboard.module').then(module => module.DashboardModule),
      canActivate: [AuthGuard] }
      ,
], { relativeLinkResolution: 'corrected' })
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
