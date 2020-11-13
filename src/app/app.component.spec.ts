import { TestBed, async, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { RouterModule } from '@angular/router';
import { AlertService } from './services/alert.service';
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AlertComponent,
      ],
      providers: [
        AlertService,
        { provide: APP_BASE_HREF, useValue : '/' },
      ],
      imports: [
        RouterModule.forRoot([], { relativeLinkResolution: 'corrected' }),
      ]
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);

    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);

    const app = fixture.debugElement.componentInstance;

    expect(app.title).toEqual('app');
  }));
});
