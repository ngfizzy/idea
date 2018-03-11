import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import NoteComponent from './components/note/note.component';

import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    AuthenticationComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    NoteComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: AuthenticationComponent },
      { path: 'dashboard', component: DashboardComponent },
    ])
  ],
  providers: [
    AlertService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
