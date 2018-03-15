import {Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isUserOptionsVisible = false;
  constructor (private userService: UserService) {
  }

  ngOnInit() {}

  /**
   * Shows users options whenever you hover over user icon
   *
   * @returns {void}
   */
  showUserOptions(): void {
    this.isUserOptionsVisible = true;
  }

  /**
   * Hides options whenever you hover over the user data
   *
   * @returns {void}
   */
  hideUserOptions(): void {
    this.isUserOptionsVisible = false;
  }

  /**
   * It logs user out
   *
   * @returns {void}
   */
  logout(): void {
    this.userService.logout();
  }

}
