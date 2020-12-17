import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { TagComponent } from './components/tag/tag.component';


@NgModule({
  imports: [CommonModule],
  exports: [
    AlertComponent,
    CommonModule,
    FormsModule,
    TagComponent
  ],
  declarations: [AlertComponent, TagComponent],
  providers: [],
})
export class SharedModule { }
