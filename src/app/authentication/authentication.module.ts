import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './smart-components/login/login.component';
import { SignupComponent } from './smart-components/signup/signup.component';

@NgModule({
  imports: [SharedModule, AuthenticationRoutingModule],
  exports: [],
  declarations: [
    ...AuthenticationRoutingModule.routeComponents,
    LoginComponent,
    SignupComponent
  ],
  providers: [],
})
export class AuthenticationModule { }
