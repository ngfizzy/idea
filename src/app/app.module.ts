import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';


import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptor } from './guards/token.interceptor';
import { NoteService } from './services/note.service';

import { HashLocationStrategy, LocationStrategy, APP_BASE_HREF } from '@angular/common';

import { PasswordResetService } from './services/password-reset.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TagService } from './services/tag.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    DashboardModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'auth',  loadChildren: () =>
      import('./authentication/authentication.module').then(module => module.AuthenticationModule)
    },
      { path: 'dashboard',
      loadChildren: () =>
      import('./dashboard/dashboard.module').then(module => module.DashboardModule),
      canActivate: [AuthGuard]
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'dashboard'
    }
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
