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

import { AuthGuard } from './guards/auth.guard';
import { NoteService } from './services/note.service';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    AuthenticationComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    NoteComponent,
    NoteEditorComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'auth', component: AuthenticationComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    ])
  ],

  providers: [
    AuthGuard,
    AlertService,
    UserService,
    NoteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
