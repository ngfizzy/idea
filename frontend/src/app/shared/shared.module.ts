import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { TagComponent } from './components/tag/tag.component';
import { ConfirmAlertComponent } from './components/confirm-alert/confirm-alert.component';


@NgModule({
  imports: [CommonModule],
  exports: [
    AlertComponent,
    ConfirmAlertComponent,
    CommonModule,
    FormsModule,
    TagComponent
  ],
  declarations: [AlertComponent, TagComponent, ConfirmAlertComponent],
  providers: [],
})
export class SharedModule { }
