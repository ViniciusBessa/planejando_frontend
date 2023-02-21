import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import * as fromApp from '../store/app.reducer';

import { MessageAlertComponent } from './message-alert.component';

describe('MessageAlertComponent', () => {
  describe('Message was dispatched', () => {
    let component: MessageAlertComponent;
    let fixture: ComponentFixture<MessageAlertComponent>;
    let compiled: HTMLElement;
    let initialState: fromApp.AppState = {
      auth: {
        user: null,
        error: null,
        loading: false,
      },
      userAccount: {
        error: null,
        loading: false,
        message: 'The password was updated!',
      },
      dashboard: {
        categories: [],
        revenues: [],
        expenses: [],
        goals: [],
        loading: false,
        error: null,
      },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [MessageAlertComponent],
        imports: [StoreModule.forRoot(), HttpClientModule],
        providers: [provideMockStore({ initialState })],
      }).compileComponents();

      fixture = TestBed.createComponent(MessageAlertComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the message', () => {
      const message = compiled.querySelector('p') as HTMLParagraphElement;
      expect(message).toBeTruthy();
      expect(message.innerText).toContain('The password was updated!');
    });

    it('should hide the message after 8 seconds', fakeAsync(() => {
      let message = compiled.querySelector('p') as HTMLParagraphElement;
      expect(message).toBeTruthy();
      expect(message.innerText).toEqual(component.message!);

      // Waiting 8 seconds to continue the test
      tick(8000);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        message = compiled.querySelector('p') as HTMLParagraphElement;
        expect(message).toBeFalsy();
        expect(component.message).toBeFalsy();
      });
    }));
  });

  describe('No message was dispatched', () => {
    let component: MessageAlertComponent;
    let fixture: ComponentFixture<MessageAlertComponent>;
    let compiled: HTMLElement;
    let initialState: fromApp.AppState = {
      auth: {
        user: null,
        error: null,
        loading: false,
      },
      userAccount: {
        error: null,
        loading: false,
        message: null,
      },
      dashboard: {
        categories: [],
        revenues: [],
        expenses: [],
        goals: [],
        loading: false,
        error: null,
      },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [MessageAlertComponent],
        imports: [StoreModule.forRoot(), HttpClientModule],
        providers: [provideMockStore({ initialState })],
      }).compileComponents();

      fixture = TestBed.createComponent(MessageAlertComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not display the message', () => {
      const message = compiled.querySelector('p') as HTMLParagraphElement;
      expect(message).toBeFalsy();
      expect(component.message).toBeFalsy();
    });
  });
});
