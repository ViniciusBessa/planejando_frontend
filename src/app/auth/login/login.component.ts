import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { GoogleAuthenticationService } from '../services/google-authentication.service';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });
  showPassword: boolean = false;

  constructor(
    private googleAuthentication: GoogleAuthenticationService,
    private store: Store<fromApp.AppState>
  ) {}

  onTogglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const { email, password } = this.form.value;

    this.store.dispatch(
      AuthActions.loginStart({ email: email!, password: password!, next: null })
    );
  }

  async onLogInWithGoogle(): Promise<void> {
    const userData = await this.googleAuthentication.initLogin();

    this.store.dispatch(
      AuthActions.loginStart({
        email: userData.info.email,
        password: userData.info.sub,
        next: null,
      })
    );
  }
}
