import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { PasswordResetService } from '../services/password-reset.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  resetToken!: string | null;
  tokenIsValid!: boolean;
  tokenSentToEmail!: boolean;
  error!: Error | null;
  loading: boolean = false;

  tokenSubscription!: Subscription;
  tokenIsValidSubscription!: Subscription;
  tokenSentToEmailSubscription!: Subscription;
  errorSubscription!: Subscription;
  loadingSubscription!: Subscription;

  requestTokenForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });
  passwordResetForm = new FormGroup({
    password: new FormControl<string>('', [Validators.required]),
  });

  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.resetToken = params['token'];

      // If there is token in the queryParams, verify it
      if (this.resetToken) {
        this.passwordResetService.verifyResetToken(this.resetToken);
      }
    });

    this.tokenSubscription = this.passwordResetService.tokenSubject.subscribe(
      (token) => {
        this.resetToken = token;
      }
    );

    this.tokenIsValidSubscription =
      this.passwordResetService.tokenIsValidSubject.subscribe((isValid) => {
        this.tokenIsValid = isValid;
      });

    this.tokenSentToEmailSubscription =
      this.passwordResetService.tokenSentToEmailSubject.subscribe(
        (sentToEmail) => {
          this.tokenSentToEmail = sentToEmail;
        }
      );

    this.errorSubscription = this.passwordResetService.errorSubject.subscribe(
      (error) => {
        this.error = error;
      }
    );

    this.loadingSubscription =
      this.passwordResetService.loadingSubject.subscribe((loading) => {
        this.loading = loading;
      });
  }

  ngOnDestroy(): void {
    // Cleaning the subscriptions
    this.tokenSubscription.unsubscribe();
    this.tokenIsValidSubscription.unsubscribe();
    this.tokenSentToEmailSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();

    // Resetting the state
    this.passwordResetService.resetTokenState();
  }

  onGetResetToken(): void {
    if (!this.requestTokenForm.valid) return;

    const { email } = this.requestTokenForm.value;

    this.passwordResetService.getResetToken(email!);
  }

  onResetPassword(): void {
    if (!this.passwordResetForm.valid || !this.resetToken) return;

    const { password } = this.passwordResetForm.value;

    this.passwordResetService.resetPassword(password!, this.resetToken);
  }

  onTogglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
