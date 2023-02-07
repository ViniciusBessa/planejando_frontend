import { Location } from '@angular/common';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngrx/effects';
import { ScannedActionsSubject } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { OverviewComponent } from 'src/app/dashboard/overview/overview.component';
import * as fromApp from '../../store/app.reducer';

import { LoginRequiredGuard } from './login-required.guard';

describe('LoginRequiredGuard', () => {
  describe('User Logged In', () => {
    let guard: LoginRequiredGuard;
    const initialState: fromApp.AppState = {
      auth: {
        user: {
          id: 9,
          name: 'TestUser',
          email: 'test@email.com',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        error: null,
        loading: false,
      },
      userAccount: {
        error: null,
        loading: false,
      },
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: 'auth/login',
              component: LoginComponent,
            },
            {
              path: 'dashboard',
              component: OverviewComponent,
              canActivate: [LoginRequiredGuard],
            },
          ]),
        ],
        providers: [
          provideMockStore({ initialState }),
          Actions,
          ScannedActionsSubject,
        ],
      });
      guard = TestBed.inject(LoginRequiredGuard);
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should let the user enter the dashboard page', fakeAsync(
      inject([Location, Router], (location: Location, router: Router) => {
        router.navigate(['/dashboard']);
        tick();
        expect(location.path()).toEqual('/dashboard');
      })
    ));
  });

  describe('User Not Logged In', () => {
    let guard: LoginRequiredGuard;
    const initialState: fromApp.AppState = {
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

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: 'auth/login',
              component: LoginComponent,
            },
            {
              path: 'dashboard',
              component: OverviewComponent,
              canActivate: [LoginRequiredGuard],
            },
          ]),
        ],
        providers: [
          provideMockStore({ initialState }),
          Actions,
          ScannedActionsSubject,
        ],
      });
      guard = TestBed.inject(LoginRequiredGuard);
      spyOn(guard, 'canActivate').and.callThrough();
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should redirect the user to the login page', fakeAsync(
      inject([Location, Router], (location: Location, router: Router) => {
        router.navigate(['/dashboard']);
        tick();
        expect(location.path()).toEqual('/auth/login?next=%2Fdashboard');
      })
    ));
  });
});
