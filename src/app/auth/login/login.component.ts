import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private googleAuthentication: GoogleAuthenticationService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((state) => {
      this.loading = state.loading;
    });
  }

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
