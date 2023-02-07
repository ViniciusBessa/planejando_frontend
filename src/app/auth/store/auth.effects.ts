import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { of, catchError, map, mergeMap, tap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserData } from '../../shared/models/user.model';
import * as AuthActions from './auth.actions';

const handleError = (
  errorResponse: HttpErrorResponse
): Observable<
  {
    error: Error | null;
  } & TypedAction<'[Auth] Auth Fail'>
> => {
  const error = errorResponse.error.err;
  return of(AuthActions.authFail({ error: new Error(error) }));
};

@Injectable()
export class AuthEffects {
  authRegister = createEffect(() =>
    this.$actions.pipe(
      ofType(AuthActions.registerStart),
      mergeMap((authData) => {
        const { name, email, password } = authData;
        return this.http
          .post<{ user: UserData; token: string }>(
            `${environment.apiUrl}/auth/register`,
            {
              name,
              email,
              password,
            }
          )
          .pipe(
            map((responseData) =>
              AuthActions.authSuccess({
                ...responseData,
                next: authData.next,
                redirect: true,
              })
            ),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  authLogin = createEffect(() =>
    this.$actions.pipe(
      ofType(AuthActions.loginStart),
      mergeMap((authData) => {
        const { email, password } = authData;
        return this.http
          .post<{ user: UserData; token: string }>(
            `${environment.apiUrl}/auth/login`,
            {
              email,
              password,
            }
          )
          .pipe(
            map((responseData) =>
              AuthActions.authSuccess({
                ...responseData,
                next: authData.next,
                redirect: true,
              })
            ),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.$actions.pipe(
        ofType(AuthActions.authSuccess),
        map((authData) => {
          localStorage.setItem('token', 'Bearer ' + authData.token);
          if (authData.redirect && authData.next) {
            this.router.navigateByUrl(authData.next);
          } else if (authData.redirect) {
            this.router.navigate(['/dashboard']);
          }
        })
      ),
    { dispatch: false }
  );

  authLogout = createEffect(
    () =>
      this.$actions.pipe(
        ofType(AuthActions.logoutUser),
        map(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/inicio']);
        })
      ),
    { dispatch: false }
  );

  authAutoLogin = createEffect(() =>
    this.$actions.pipe(
      ofType(AuthActions.autoLogin),
      mergeMap(() =>
        this.http
          .get<{ user: UserData; token: string }>(
            `${environment.apiUrl}/auth/user`
          )
          .pipe(
            map((responseData) =>
              AuthActions.authSuccess({
                ...responseData,
                next: null,
                redirect: false,
              })
            ),
            catchError(() => of(AuthActions.authFail({ error: null })))
          )
      )
    )
  );

  constructor(
    private $actions: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
