import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as UserAccountActions from '../user-account/store/user-account.actions';
import * as DashboardActions from '../dashboard/store/dashboard.actions';
import { PasswordResetService } from '../auth/services/password-reset.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.css'],
})
export class ErrorAlertComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  errorTimeout: NodeJS.Timeout | null = null;
  animationTimeout: NodeJS.Timeout | null = null;
  passwordResetSubs!: Subscription;

  @ViewChild('errorParagraph') errorParagraph!: ElementRef;

  constructor(
    private store: Store<fromApp.AppState>,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((state) => {
      if (state.error) {
        this.onSetError(state.error.message);
        this.store.dispatch(AuthActions.resetError());
      }
    });

    this.store.select('userAccount').subscribe((state) => {
      if (state.error) {
        this.onSetError(state.error.message);
        this.store.dispatch(UserAccountActions.resetError());
      }
    });

    this.store.select('dashboard').subscribe((state) => {
      if (state.error) {
        this.onSetError(state.error.message);
        this.store.dispatch(DashboardActions.resetError());
      }
    });

    this.passwordResetSubs = this.passwordResetService.errorSubject.subscribe(
      (error) => {
        if (error) {
          this.onSetError(error.message);
          this.passwordResetService.errorSubject.next(null);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    this.passwordResetSubs?.unsubscribe();
  }

  onSetError(error: string): void {
    this.errorMessage = error;

    if (this.errorTimeout) {
      this.onResetAnimation();
      clearTimeout(this.errorTimeout);
    }
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = null;
      this.errorTimeout = null;
    }, 8000);
  }

  onResetAnimation(): void {
    this.errorParagraph.nativeElement.style.animation = 'none';

    this.animationTimeout = setTimeout(() => {
      this.errorParagraph.nativeElement.style.animation = '';
    }, 100);
  }
}
