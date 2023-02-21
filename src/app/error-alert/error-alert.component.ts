import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as UserAccountActions from '../user-account/store/user-account.actions';
import * as DashboardActions from '../dashboard/store/dashboard.actions';
import { PasswordResetService } from '../auth/services/password-reset.service';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.css'],
})
export class ErrorAlertComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(
    private store: Store<fromApp.AppState>,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((state) => {
      if (state.error) {
        this.errorMessage = state.error.message;
        this.onResetError();
        this.store.dispatch(AuthActions.resetError());
      }
    });

    this.store.select('userAccount').subscribe((state) => {
      if (state.error) {
        this.errorMessage = state.error.message;
        this.onResetError();
        this.store.dispatch(UserAccountActions.resetError());
      }
    });

    this.store.select('dashboard').subscribe((state) => {
      if (state.error) {
        this.errorMessage = state.error.message;
        this.onResetError();
        this.store.dispatch(DashboardActions.resetError());
      }
    });

    this.passwordResetService.errorSubject.subscribe((error) => {
      if (error) {
        this.errorMessage = error.message;
        this.onResetError();
        this.passwordResetService.errorSubject.next(null);
      }
    });
  }

  onResetError(): void {
    setTimeout(() => (this.errorMessage = null), 8000);
  }
}
