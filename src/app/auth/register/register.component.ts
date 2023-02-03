import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { GoogleAuthenticationService } from '../services/google-authentication.service';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(40),
    ]),
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });
  showPassword: boolean = false;

  constructor(
    private googleAuthentication: GoogleAuthenticationService,
    private store: Store<fromApp.AppState>
  ) {}

  onTogglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.form.valid) return;

    const { name, email, password } = this.form.value;

    this.store.dispatch(
      AuthActions.registerStart({
        name: name!,
        email: email!,
        password: password!,
        profile_image: '',
        next: null,
      })
    );
  }

  async onRegisterWithGoogle(): Promise<void> {
    const userData = await this.googleAuthentication.initLogin();
    const email = userData.info.email as string;
    const password = userData.info.sub as string;
    const name = userData.info.name as string;
    const profile_image = userData.picture as string;

    this.store.dispatch(
      AuthActions.registerStart({
        name,
        email,
        password,
        profile_image,
        next: null,
      })
    );
  }
}
