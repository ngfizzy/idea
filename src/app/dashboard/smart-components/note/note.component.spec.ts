import { TestBed, ComponentFixture, async, waitForAsync } from '@angular/core/testing';
import { NoteComponent } from './note.component';

import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { NoteService } from '../../../services/note.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

describe('NoteComponent', () => {
  let fixture: ComponentFixture<NoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        NoteComponent,
        AlertComponent,
      ],
      providers: [
        AlertService,
        {
          provide: NoteService,
          useValue: new class {
            removeNote(noteId) {
              if (noteId) {
                return of(true);
              }

              return throwError('could not delete note');
            }
          }(),
        },
        {provide: APP_BASE_HREF, useValue: '/'},
      ],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(NoteComponent);
  }));

  it('should have a title', waitForAsync(() => {
    const componentInstace = fixture.componentInstance;
    const compiledComponent: HTMLElement = fixture.nativeElement;

    componentInstace.note = {title: 'note title'};
    fixture.detectChanges();

    expect(compiledComponent.querySelector('.note-title').textContent)
      .toContain('note title');
  }));

  it('should have a body', waitForAsync(() => {
    const componentInstance = fixture.componentInstance;
    const compiledComponent: HTMLElement = fixture.nativeElement;

    componentInstance.note = {content: 'note content'};
    fixture.detectChanges();

    expect(compiledComponent.querySelector('.body').textContent).toContain('note content');
  }));

  it('should have a delete button', waitForAsync(() => {
    const compiledComponent: HTMLElement = fixture.nativeElement;

    const deleteButton = compiledComponent.querySelector('.delete');

     expect(deleteButton).not.toBeNull();
     expect(deleteButton).not.toBeUndefined();
  }));

  it('can be deleted', waitForAsync(() => {
    const componentInstance = fixture.componentInstance;
    const noteService: NoteService = TestBed.inject(NoteService);
    spyOn(noteService, 'removeNote').and.returnValue(of('Note Deleted Successfully'));
    componentInstance.note = {id: 1};
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.delete')).triggerEventHandler('click', null);

    expect(noteService.removeNote).toHaveBeenCalledTimes(1);
  }));

  it('should trigger an error alert when delete fails', waitForAsync(() => {
    const alertComponentFixture = TestBed.createComponent(AlertComponent);
    const alertComponentInstance = alertComponentFixture.componentInstance;
    const noteComponentInstance = fixture.componentInstance;
    noteComponentInstance.note = {};
    fixture.detectChanges();
    const debugElemet: DebugElement =  fixture.debugElement;

    debugElemet.query(By.css('.delete')).triggerEventHandler('click', null);
    alertComponentFixture.detectChanges();

    expect(alertComponentInstance.message).toContain('could not delete note');
  }));
});
