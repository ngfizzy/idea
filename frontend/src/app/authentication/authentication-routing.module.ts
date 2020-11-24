import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticationComponent } from './route-components/authentication/authentication.component';
import { PasswordResetFormComponent } from './route-components/password-reset-form/password-reset-form.component';
import { PasswordResetRequestFormComponent } from './route-components/password-reset-request-form/password-reset-request-form.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      pathMatch: 'full',
      component: AuthenticationComponent
    },
    { path: 'passwords/reset', component: PasswordResetRequestFormComponent },
    { path: 'passwords/reset/:token', component: PasswordResetFormComponent },
  ])],
  exports: [RouterModule],
  providers: [],
})
export class AuthenticationRoutingModule {
  static readonly routeComponents = [
    PasswordResetRequestFormComponent,
    PasswordResetFormComponent,
    AuthenticationComponent,
  ];
}
