import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  @Input() show: boolean;
  @Output() showSignup: EventEmitter<null> = new EventEmitter();

  constructor() {
    this.show = false;
  }
  ngOnInit() { }

  /**
   * It emmits showSignup event
   *
   * @return {void}
   */
  signup() {
    this.showSignup.emit();
  }
}
