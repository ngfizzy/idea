import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';


@NgModule({
  imports: [CommonModule],
  exports: [AlertComponent, CommonModule, FormsModule],
  declarations: [AlertComponent],
  providers: [],
})
export class SharedModule { }
