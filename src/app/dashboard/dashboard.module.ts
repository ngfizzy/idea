import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ToolsComponent } from './presentation-components/tools/tools.component';
import { NoteComponent } from './smart-components/note/note.component';


@NgModule({
  imports: [DashboardRoutingModule, CommonModule, FormsModule],
  exports: [],
  declarations: [
    ...DashboardRoutingModule.routeComponents,
    ToolsComponent,
    NoteComponent
  ],
  providers: [],
})
export class DashboardModule { }
