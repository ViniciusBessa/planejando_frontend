import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.css'],
})
export class ErrorAlertComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>) {}
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.store.select('auth').subscribe((state) => {
      if (state.error) {
        this.errorMessage = state.error.message;
        this.onResetError();
        this.store.dispatch(AuthActions.resetError());
      }
    });
  }

  onResetError(): void {
    setTimeout(() => (this.errorMessage = null), 8000);
  }
}
