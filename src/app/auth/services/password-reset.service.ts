import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../../store/app.reducer';
import { UserData } from '../../shared/models/user.model';
import * as AuthActions from '../store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  tokenSubject = new BehaviorSubject<string | null>(null);
  tokenIsValidSubject = new BehaviorSubject<boolean>(false);
  tokenSentToEmailSubject = new BehaviorSubject<boolean>(false);
  errorSubject = new BehaviorSubject<Error | null>(null);
  loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  getResetToken(email: string): void {
    this.loadingSubject.next(true);
    this.http
      .post<{ resetToken?: string }>(
        `${environment.apiUrl}/users/resetpassword`,
        {
          email,
        }
      )
      .pipe(catchError(this.handleRequestError.bind(this)))
      .subscribe({
        next: (result) => {
          if (result.resetToken) {
            this.tokenSubject.next(result.resetToken);
            this.tokenIsValidSubject.next(true);
          } else {
            this.tokenSentToEmailSubject.next(true);
          }
        },
        error: (err) => {
          this.errorSubject.next(err);
          this.loadingSubject.next(false);
        },
        complete: () => this.loadingSubject.next(false),
      });
  }

  verifyResetToken(token: string): void {
    this.loadingSubject.next(true);
    this.http
      .post<{ valid: boolean }>(
        `${environment.apiUrl}/users/resetpassword/check`,
        {
          token,
        }
      )
      .pipe(catchError(this.handleRequestError.bind(this)))
      .subscribe({
        next: (result) => {
          this.tokenSubject.next(token);
          this.tokenIsValidSubject.next(result.valid);

          if (!result.valid) {
            const tokenIsInvalidMessage = `O token ${token} é inválido`;
            this.errorSubject.next(new Error(tokenIsInvalidMessage));
          }
        },
        error: (err) => {
          this.errorSubject.next(err);
          this.loadingSubject.next(false);
        },
        complete: () => this.loadingSubject.next(false),
      });
  }

  resetPassword(password: string, token: string): void {
    this.loadingSubject.next(true);
    this.http
      .patch<{ user: UserData; token: string }>(
        `${environment.apiUrl}/users/resetpassword`,
        {
          newPassword: password,
          token,
        }
      )
      .pipe(catchError(this.handleRequestError.bind(this)))
      .subscribe({
        next: (result) =>
          this.store.dispatch(
            AuthActions.authSuccess({
              user: result.user,
              token: result.token,
              next: null,
              redirect: true,
            })
          ),
        error: (err) => {
          this.errorSubject.next(err);
          this.loadingSubject.next(false);
        },
        complete: () => this.loadingSubject.next(false),
      });
  }

  private handleRequestError(error: HttpErrorResponse): Observable<never> {
    const requestError = new Error(error.error.err);
    return throwError(() => requestError);
  }

  resetTokenState(): void {
    this.tokenSubject.next(null);
    this.tokenIsValidSubject.next(false);
    this.tokenSentToEmailSubject.next(false);
    this.errorSubject.next(null);
  }
}
