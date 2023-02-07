import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { ErrorAlertComponent } from './error-alert.component';
import * as fromApp from '../store/app.reducer';
import { HttpClientModule } from '@angular/common/http';

describe('ErrorAlertComponent', () => {
  describe('Error occurred', () => {
    let component: ErrorAlertComponent;
    let fixture: ComponentFixture<ErrorAlertComponent>;
    let compiled: HTMLElement;
    let initialState: fromApp.AppState = {
      auth: {
        user: null,
        error: new Error('An error occurred'),
        loading: false,
      },
      userAccount: {
        error: null,
        loading: false,
      },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ErrorAlertComponent],
        imports: [StoreModule.forRoot(), HttpClientModule],
        providers: [provideMockStore({ initialState })],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorAlertComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display the error message', () => {
      const message = compiled.querySelector('p') as HTMLParagraphElement;
      expect(message).toBeTruthy();
      expect(message.innerText).toContain('An error occurred');
    });

    it('should hide the error message after 8 seconds', fakeAsync(() => {
      let message = compiled.querySelector('p') as HTMLParagraphElement;
      expect(message).toBeTruthy();
      expect(message.innerText).toEqual(component.errorMessage!);

      // Waiting 8 seconds to continue the test
      tick(8000);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        message = compiled.querySelector('p') as HTMLParagraphElement;
        expect(message).toBeFalsy();
        expect(component.errorMessage).toBeFalsy();
      });
    }));
  });

  describe('No Error occurred', () => {
    let component: ErrorAlertComponent;
    let fixture: ComponentFixture<ErrorAlertComponent>;
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
      },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ErrorAlertComponent],
        imports: [StoreModule.forRoot(), HttpClientModule],
        providers: [provideMockStore({ initialState })],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorAlertComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not display the error message', () => {
      const message = compiled.querySelector('p') as HTMLParagraphElement;
      expect(message).toBeFalsy();
      expect(component.errorMessage).toBeFalsy();
    });
  });
});
