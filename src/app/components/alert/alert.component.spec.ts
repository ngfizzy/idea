import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from '../../services/alert.service';
import { APP_BASE_HREF } from '@angular/common';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AlertComponent
      ],
      providers: [
        AlertService,
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    });
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AlertComponent);
  }));

  it('can open through AlertService', async(() => {
    const alertService: AlertService = TestBed.get(AlertService);
    const compiledComponent: HTMLElement = fixture.nativeElement;

    alertService.open('this is opened');
    fixture.detectChanges();

    expect(compiledComponent.querySelector('.wrapper').getAttribute('hidden')).toBeNull();
    expect(compiledComponent.textContent.toLowerCase()).toContain('this is opened');
  }));

  it('can close through alert service', async(() => {
    const alertService: AlertService = TestBed.get(AlertService);
    const compiledComponent: HTMLElement = fixture.nativeElement;
    alertService.open();
    fixture.detectChanges();

    alertService.close(() => {});
    fixture.detectChanges();

    expect(compiledComponent.querySelector('.wrapper').getAttribute('hidden')).not.toBeNull();
  }));
});
