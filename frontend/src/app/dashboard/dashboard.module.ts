import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ToolsComponent } from './presentation-components/tools/tools.component';
import { NoteComponent } from './smart-components/note/note.component';


@NgModule({
  imports: [DashboardRoutingModule, SharedModule],
  exports: [],
  declarations: [
    ...DashboardRoutingModule.routeComponents,
    ToolsComponent,
    NoteComponent
  ],
  providers: [],
})
export class DashboardModule { }
