import { AlertComponent } from '../shared/components/alert/alert.component';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let alertService: AlertService;
  let alertComponent: AlertComponent;

  beforeEach(() => {
    alertService = new AlertService();
    alertComponent = new AlertComponent(alertService);
  });

  it('can register a component', () => {
    alertService.registerAlertComponent(alertComponent);

    const registeredComponent = alertService.getRegisteredComponent();

    expect(registeredComponent instanceof AlertComponent).toBe(true);
  });

  it('can open alert', () => {
    spyOn(alertComponent, 'open').and.callThrough();

    alertService.open('message');

    expect(alertComponent.open).toHaveBeenCalled();
    expect(alertComponent.isOpen).toBe(true);
  });

  it('can close alert', () => {
    alertService.open();

    alertService.close(() => {});

    expect(alertComponent.isOpen).toBe(false);
  });
});

