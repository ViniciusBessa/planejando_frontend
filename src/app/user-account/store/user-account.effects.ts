import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { of, catchError, map, mergeMap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserData } from '../../shared/models/user.model';
import * as UserAccountActions from './user-account.actions';
import * as AuthActions from '../../auth/store/auth.actions';

const handleError = (
  errorResponse: HttpErrorResponse
): Observable<
  {
    error: Error | null;
  } & TypedAction<'[User Account] Update Fail'>
> => {
  const error = errorResponse.error.err;
  return of(UserAccountActions.updateFail({ error: new Error(error) }));
};

@Injectable()
export class UserAccountEffects {
  updateName = createEffect(() =>
    this.$actions.pipe(
      ofType(UserAccountActions.updateNameStart),
      mergeMap((userAccountData) => {
        const { newName } = userAccountData;
        return this.http
          .patch<{ user: UserData; token: string }>(
            `${environment.apiUrl}/users/account/name`,
            {
              newName,
            }
          )
          .pipe(
            map((responseData) =>
              UserAccountActions.updateSuccess({
                ...responseData,
              })
            ),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  updateEmail = createEffect(() =>
    this.$actions.pipe(
      ofType(UserAccountActions.updateEmailStart),
      mergeMap((userAccountData) => {
        const { newEmail } = userAccountData;
        return this.http
          .patch<{ user: UserData; token: string }>(
            `${environment.apiUrl}/users/account/email`,
            {
              newEmail,
            }
          )
          .pipe(
            map((responseData) =>
              UserAccountActions.updateSuccess({
                ...responseData,
              })
            ),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  updatePassword = createEffect(() =>
    this.$actions.pipe(
      ofType(UserAccountActions.updatePasswordStart),
      mergeMap((userAccountData) => {
        const { newPassword } = userAccountData;
        return this.http
          .patch<{ user: UserData; token: string }>(
            `${environment.apiUrl}/users/account/password`,
            {
              newPassword,
            }
          )
          .pipe(
            map((responseData) =>
              UserAccountActions.updateSuccess({
                ...responseData,
              })
            ),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  updateSuccess = createEffect(() =>
    this.$actions.pipe(
      ofType(UserAccountActions.updateSuccess),
      map((userAccountData) => {
        return AuthActions.authSuccess({
          ...userAccountData,
          next: null,
          redirect: false,
        });
      })
    )
  );

  deleteAccountStart = createEffect(() =>
    this.$actions.pipe(
      ofType(UserAccountActions.deleteAccountStart),
      mergeMap((userAccountData) => {
        const { password } = userAccountData;
        return this.http
          .delete<{ user: UserData }>(`${environment.apiUrl}/users/account`, {
            body: { password },
          })
          .pipe(
            map(() => UserAccountActions.deleteAccountSuccess()),
            catchError(handleError.bind(this))
          );
      })
    )
  );

  deleteAccountSuccess = createEffect(() =>
    this.$actions.pipe(
      ofType(UserAccountActions.deleteAccountSuccess),
      map(() => AuthActions.logoutUser())
    )
  );

  constructor(private $actions: Actions, private http: HttpClient) {}
}
