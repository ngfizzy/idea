import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {

  private alert: any;
  private defaultMessage;
  private defaultDismissText;

  constructor() {
    this.defaultMessage = 'Action Completed';
    this.defaultDismissText = 'Okay';
  }

  /**
   * Registers an angular component as an alert
   *
   * @param {any} alert A regular angular component
   *
   * @returns {void}
   */
  registerAlertComponent(alert: any): void {
    this.alert = alert;
  }

  /**
   * Opens an alert
   *
   * @param {string} message Message displayed in the alert;
   * @param dismissText The text which appears on the alert's close button
   * @param afterClose Called after the alert closes
   *
   * @returns {void}
   */
  open(
    message: string = this.defaultMessage,
    dismissText: string = this.defaultDismissText,
    afterClose = () => {}): void {
    if (this.alert) {
      this.alert.open(message, dismissText);
      this.alert.afterClose = afterClose;
    }
  }

  /**
   * Closes an alert
   *
   * @param afterClose It is called after alert closes
   *
   * @returns {void}
   */
  close(afterClose?: () => any): void {
    if (this.alert) {
      this.alert.isOpen = false;
      afterClose();
    }
  }

  /**
   * Get registered component
   *
   * @return {any}
   */
  getRegisteredComponent() {
    return this.alert;
  }
}
