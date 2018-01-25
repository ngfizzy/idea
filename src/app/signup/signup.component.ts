import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  @Output() showLogin: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {

  }

  /**
   * It emits the showLogin event
   *
   * @returns {void}
   */
  login(): void {
    this.showLogin.emit();
  }
}
