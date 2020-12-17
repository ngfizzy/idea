import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ToolsComponent } from './presentation-components/tools/tools.component';
import { NoteComponent } from './smart-components/note/note.component';
import { SidenavComponent } from './smart-components/sidenav/sidenav.component';


@NgModule({
  imports: [DashboardRoutingModule, SharedModule],
  exports: [],
  declarations: [
    ...DashboardRoutingModule.routeComponents,
    ToolsComponent,
    NoteComponent,
    SidenavComponent,
  ],
  providers: [],
})
export class DashboardModule { }
