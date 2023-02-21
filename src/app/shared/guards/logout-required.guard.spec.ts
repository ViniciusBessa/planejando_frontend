import { Location } from '@angular/common';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngrx/effects';
import { ScannedActionsSubject } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { HomeComponent } from 'src/app/home/home.component';
import * as fromApp from '../../store/app.reducer';

import { LogoutRequiredGuard } from './logout-required.guard';

describe('LogoutRequiredGuard', () => {
  describe('User Logged In', () => {
    let guard: LogoutRequiredGuard;
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

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: 'auth/login',
              component: LoginComponent,
              canActivate: [LogoutRequiredGuard],
            },
            {
              path: 'inicio',
              component: HomeComponent,
            },
          ]),
        ],
        providers: [
          provideMockStore({ initialState }),
          Actions,
          ScannedActionsSubject,
        ],
      });
      guard = TestBed.inject(LogoutRequiredGuard);
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should redirect the user to the home page', fakeAsync(
      inject([Location, Router], (location: Location, router: Router) => {
        router.navigate(['auth/login']);
        tick();
        expect(location.path()).toEqual('/inicio');
      })
    ));
  });

  describe('User Not Logged In', () => {
    let guard: LogoutRequiredGuard;
    const initialState: fromApp.AppState = {
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

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([
            {
              path: 'auth/login',
              component: LoginComponent,
              canActivate: [LogoutRequiredGuard],
            },
            {
              path: 'inicio',
              component: HomeComponent,
            },
          ]),
        ],
        providers: [
          provideMockStore({ initialState }),
          Actions,
          ScannedActionsSubject,
        ],
      });
      guard = TestBed.inject(LogoutRequiredGuard);
    });

    it('should be created', () => {
      expect(guard).toBeTruthy();
    });

    it('should let the user enter the login page', fakeAsync(
      inject([Location, Router], (location: Location, router: Router) => {
        router.navigate(['auth/login']);
        tick();
        expect(location.path()).toEqual('/auth/login');
      })
    ));
  });
});
