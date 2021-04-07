import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'ida-confirm-alert',
  template: `
    <div [hidden]="!isOpen" class="wrapper" (click)="close($event)">
      <div class="alert">
        <p [innerHTML]="labels.alert"></p>

        <div class="actions">
          <button class="btn-close" (click)="close($event)">{{labels.dismiss}}</button>
          <button class="btn-confirm" (click)="confirm($event)">{{labels.confirm}}</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../base-alert.scss'],
  styles: [`
    button {
      padding: 10px;
      display: inline-flex;
      outline: none;
      border: none;
      border-radius: .5rem;
      margin: .5rem;
    }

    .actions {
      display: flex;
      flex-direction: row-reverse;
    }

    .btn-confirm {
      background-color: #fff;
      border: 1px solid #54426B;
      color: #54426B;
      margin-left: .5rem;
    }

    .btn-close {
      background-color: #54426B;
      color: #fff;
    }
  `]
})
export class ConfirmAlertComponent {
  isOpen = false;

  actions = {
    afterClose: () => {},
    afterConfirm: () => {}
  }

  labels = {
    alert: 'Are you sure you want to continue',
    confirm: 'Confirm',
    dismiss: 'Dismiss'
  }

  constructor(private alertService: AlertService) {
    this.alertService.registerConfirmationAlert(this);
  }

  /**
   * It shows the alert component
   *
   * @param message message displayed in the alert
   * @param dismissText message
   *
   * @returns {void}
   */
  open(
    labels = this.labels,
    actions = this.actions
  ): void {
    this.isOpen = true;

    this.labels  = labels;
    this.actions = actions;
  }

  confirm(event) {
    this.actions.afterConfirm()

    this.isOpen = this.alertService.isAlertClicked(event);

    !this.isOpen && this.actions.afterClose();
  }

  /**
   * Closes the alert
   *
   * @param event event from the DOM
   *
   * @returns {void}
   */
  close(event):void {
    this.isOpen = this.alertService.isAlertClicked(event);

    !this.isOpen && this.actions.afterClose();
  }

}
