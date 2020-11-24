import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoteEditorComponent } from './route-components/note-editor/note-editor.component';

import { DashboardComponent } from './route-components/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
    {
      path: '',
      pathMatch: 'full',
      component: DashboardComponent,
      // canActivate: [AuthGuard],
      // children: [
      //   {
      //     path: 'note/:id/edit',
      //     pathMatch: 'full',
      //     component: NoteEditorComponent
      //   }
      // ]
    }
  ])],
  exports: [RouterModule],
  providers: [],
})
export class DashboardRoutingModule {
  static readonly routeComponents = [DashboardComponent, NoteEditorComponent];
}
